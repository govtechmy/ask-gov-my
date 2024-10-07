import { getAgencyList, getAllTopics } from "@/actions/questionServices";
import WordTranslate from "@/components/common/WordTranslate";
import { FSP, inject } from "@/lib/decorator";
import { Topic } from "@/types/types";
import TopicSidebarDropdown from "./dropdown";
import TopicSidebarList from "./list";

interface TopicsBarProps {
  topics: Topic[];
}

const TopicsSidebar: FSP<TopicsBarProps> = ({ data, params }) => {
  const { topics } = data!;
  return (
    <div className="w-full lg:w-[300px] flex flex-col gap-6">
      <WordTranslate
        translate={"Topics"}
        keyword={"topic"}
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
    const agencies = await getAgencyList();

    const agencyId = agencies.find(
      (agency) => agency.acronym.toLowerCase() === params.agencyAcronym
    )?.id;

    const topics = await getAllTopics(agencyId);

    return {
      topics,
    };
  },
});
