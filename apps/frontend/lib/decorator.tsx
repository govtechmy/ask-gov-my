import { FunctionComponent, ReactNode } from "react";
import { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { getServerSession, Session } from "next-auth";
import { HttpStatusCode } from "@askgovmy/utils";
import { getCsrfToken } from "next-auth/react";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getURLRouter } from "./server-helper";
import { redirect } from "next/navigation";
import Error from "@/components/layout/server/error";

export type Context = {
  session: Session | null;
  csrf?: string;
  router?: URL;
};

export interface ContextArgs {
  params: Record<string, any>;
  context: Context;
  searchParams: Record<string, any>;
}
export type MiddlewareFunction = (
  params: ContextArgs
) => Promise<MiddlewareResponseProps>;

export type MiddlewareResponseProps = {
  status: HttpStatusCode;
  message?: string;
  redirect?: string;
};

export type FSP<T = unknown> = FunctionComponent<ServerProp<T>>;
export type FSM = Record<"locale", any>;

export type ServerProp<T = unknown> = {
  context: Context;
  error?: MiddlewareResponseProps;
  data?: NonNullable<Awaited<T>> | null;
  params?: Record<string, any>;
  searchParams?: Record<string, any>;
  locale: "en-GB" | "ms-MY";
  children?: ReactNode;
};

export type ServerOption<T> = {
  data?: (props: ContextArgs) => T | Promise<T>;
  middleware?: MiddlewareFunction[];
  debug?: boolean;
};

export const inject = <T,>(
  Component: FunctionComponent<ServerProp<T>>,
  option?: ServerOption<T>
) => {
  return async ({
    params = {},
    searchParams = {},
  }: Pick<ServerProp, "params" | "searchParams">) => {
    const CONTEXTS = {
      session: getServerSession(authOptions),
      csrf: getCsrfToken(),
      router: new Promise((resolve) => resolve(getURLRouter())),
    };

    let props: ServerProp = {
      context: { session: null },
      params,
      searchParams,
      locale: params.locale || "ms-MY",
    };

    const results = await Promise.allSettled(Object.values(CONTEXTS));
    const keys = Object.keys(CONTEXTS);

    // 1. Resolve context dependencies
    props.context = results.reduce((acc, result, index) => {
      if (result.status === "fulfilled") {
        const key = keys[index];
        if (!key) return acc;

        return { ...acc, [key]: result.value };
      }
      return acc;
    }, props.context);

    // 2. Run middlewares
    if (option?.middleware) {
      try {
        for (const middleware of option.middleware) {
          await middleware({
            params,
            searchParams,
            context: props.context,
          });
        }
      } catch (error) {
        if (error.redirect) return redirect(error.redirect);
        if (error.status !== HttpStatusCode.OK_200)
          return <Error {...{ ...props, error: error }} />;
      }
    }

    // 3. Resolve data dependency
    if (option?.data)
      props.data =
        (await option.data({
          params,
          context: props.context,
          searchParams,
        })) || null;

    // 4. Return page with server props
    if (option?.debug)
      return (
        <div className="bg-black text-green-600">
          <pre className="text-xs ">{JSON.stringify(props.data, null, 4)}</pre>
        </div>
      );

    unstable_setRequestLocale(props.locale);

    return (
      <Component
        {...({
          ...{ params, searchParams },
          ...(props as ServerProp<T>),
        } as const)}
      />
    );
  };
};

type MetagenMapper = {
  [P in keyof Metadata]: string;
};

export type MetagenProps = {
  params: Record<string, string>;
  searchParams: { [key: string]: string | string[] | undefined };
};

export const metagen = async (
  props: MetagenProps,
  namespace: string,
  map: MetagenMapper
): Promise<Metadata> => {
  const t = await getTranslations({ locale: props.params.locale, namespace });
  return {
    title: map.title ? `${t(map.title)} | AskMyGov` : "AskMyGov",
    description: map.description
      ? t(map.description)
      : "Your one-stop centre to ask questions to Government officers!",
  };
  return {};
};
