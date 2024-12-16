import { FSP } from "@/lib/decorator";
import { route } from "@/lib/routes";
import { permanentRedirect } from "next/navigation";
import { RedirectType } from "next/dist/client/components/redirect";
import { cache } from "react";

const RedirectToTopicPage: FSP = cache(({ params }) => {
  return permanentRedirect(
    route("agencyTopic", { ...params, topicId: "all" }),
    RedirectType.replace
  );
});

export default RedirectToTopicPage;
