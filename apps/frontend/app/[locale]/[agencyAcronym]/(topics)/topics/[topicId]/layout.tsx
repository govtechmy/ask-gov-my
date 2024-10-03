import React from "react";
import TopicsSidebar from "./@sidebar/page";

export default async function TopicLayout({ children, params }) {
  return (
    <>
      <div className="container p-4.5 lg:py-8 flex-col-reverse lg:flex-row flex print:mt-0 print:max-w-none gap-4.5 lg:gap-12">
        <div className="flex-1">{children}</div>
        <TopicsSidebar
          params={{
            agencyAcronym: params.agencyAcronym,
            locale: params.locale,
            topicId: params.topicId,
          }}
        />
      </div>
    </>
  );
}
