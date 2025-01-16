import StaffGuideEN from "./staff-guide-en.mdx";
import StaffGuideMS from "./staff-guide-ms.mdx";

type Props = {
  params: {
    locale: "en-GB" | "ms-MY";
  };
};

export default function Page({ params }: Props) {
  const { locale } = params;

  if (locale === "en-GB") {
    return <StaffGuideEN />;
  }

  return <StaffGuideMS />;
}
