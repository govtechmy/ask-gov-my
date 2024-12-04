import { getAgencyList } from "@/actions/public/agency";
import { FSP, inject } from "@/lib/decorator";
import { Topic } from "@/types/types";
import TopicSidebarDropdown from "./dropdown";
import TopicSidebarList from "./list";
import { getAllTopics } from "@/actions/public/topic";
import { notFound } from "next/navigation";
import Translator from "@/components/client/translator";

interface TopicsBarProps {
  topics: Topic[];
}

const TopicsSidebar: FSP<TopicsBarProps> = ({ data, params }) => {
  const { topics } = data!;
  return (
    <div className="w-full lg:w-[300px] flex flex-col gap-6">
      <Translator
        namespace="Topics.topic"
        className="font-semibold text-base text-black-700 hidden lg:block"
      />

      <TopicSidebarList params={params} topics={topics} />
      <TopicSidebarDropdown params={params} topics={topics} />
    </div>
  );
};

export default inject(TopicsSidebar, {
  // debug: true,
  async data({ params }) {
    const { data: agencies } = await getAgencyList();

    if (!agencies) {
      return notFound();
    }

    const agencyId = agencies.find(
      (agency) => agency.acronym.toLowerCase() === params.agencyAcronym
    )?.id;

    const topics = await getAllTopics({ agencyId }, params);

    return {
      topics: topics.data,
    };
  },
});
