import { DeepKeys } from "@/types/types";
import { extract } from "@askgovmy/utils";

export const routes = {
  home: "/",
  searchresults: "/searchresults/",
  agency: "/:agencyAcronym/",
  agencyTopic: "/:agencyAcronym/topics/:topicId",
  admin: {
    index: "/admin/",
  },
};

const serializeQuery = (data: Record<string, any>) => {
  return Object.entries(data).reduce((prev, [key, value], index) => {
    return prev.concat(
      ...[key, "=", value, Object.keys(data).length - 1 === index ? "" : "&"]
    );
  }, "?");
};

const route = (
  namespace: DeepKeys<typeof routes>,
  params: Record<string, any> | undefined | null,
  query?: Record<string, any>
) => {
  let template = extract(routes, namespace);
  if (!params && !query) return template;

  if (params && params !== null) {
    template = Object.entries(params).reduce((prev, [key, value]) => {
      return prev.replace(`:${[key]}`, value);
    }, template);
  }

  if (query) {
    template = Object.entries(query).reduce((prev, [key, value], index) => {
      return prev.concat(
        ...[key, "=", value, Object.keys(query).length - 1 === index ? "" : "&"]
      );
    }, template + "?");
  }

  return template;
};

export { route, serializeQuery };
