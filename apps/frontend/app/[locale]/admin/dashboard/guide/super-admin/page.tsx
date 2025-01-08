import SuperAdminGuideEN from "./super-admin-guide-en.mdx";
import SuperAdminGuideMS from "./super-admin-guide-ms.mdx";

type Props = {
  params: {
    locale: "en-GB" | "ms-MY";
  };
};

export default function Page({ params }: Props) {
  const { locale } = params;

  if (locale === "en-GB") {
    return <SuperAdminGuideEN />;
  }

  return <SuperAdminGuideMS />;
}
