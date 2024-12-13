"use client";

import { Link } from "@/lib/i18n";
import { route } from "@/lib/routes";
import { Topic } from "@/types/types";
import { cn } from "@askgovmy/utils";
import { useTranslations } from "next-intl";
import { FC, useEffect, useRef } from "react";

interface TopicSidebarListProps {
  params?: Record<string, any>;
  topics: Topic[];
}

const TopicSidebarList: FC<TopicSidebarListProps> = ({ params, topics }) => {
  const t = useTranslations("Topics");
  const itemListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const itemList = itemListRef.current;

    if (itemList) {
      const listItems = itemList.children;

      // Check if there are more than 10 items
      if (listItems.length > 10) {
        // Calculate total height of the first 10 items
        let totalHeight = 0;
        for (let i = 0; i < 10; i++) {
          // Plus 8 bcs the gap-2 applied on each element
          totalHeight += listItems[i].clientHeight + 8;
        }

        // Apply the height and enable scrolling
        itemList.style.maxHeight = `${totalHeight}px`;
        itemList.style.overflowY = "scroll";
        itemList.style.overflowX = "visible";
      }
    }
  }, [topics]);

  return (
    <ul ref={itemListRef} className="flex-col gap-2 -mx-3 px-3 hidden lg:flex">
      <Link
        key={`topic-all`}
        href={route("agencyTopic", { ...params, topicId: "all" })}
        scroll={false}
      >
        <div
          className={cn(
            `h-10 rounded-lg -mx-3 py-2 px-3 hover:cursor-pointer`,
            `${params?.topicId === "all" ? "bg-askmygovbrand-50 text-askmygovtextbrand-600" : "bg-inherit text-black-800"} `
          )}
        >
          {t("alltopics")}
        </div>
      </Link>
      {topics.map((topic, index) => (
        <Link
          key={`topic-${index}`}
          href={route("agencyTopic", { ...params, topicId: topic.id })}
          scroll={false}
        >
          <div
            className={cn(
              `rounded-lg -mx-3 py-2 px-3 hover:cursor-pointer hover:text-askmygovtextbrand-600`,
              `${params?.topicId && Number(params?.topicId) === topic.id ? "bg-askmygovbrand-50 text-askmygovtextbrand-600" : "bg-inherit text-black-800"} `
            )}
          >
            {params?.locale === "ms-MY" ? topic.title_ms : topic.title}&nbsp;
          </div>
        </Link>
      ))}
    </ul>
  );
};

export default TopicSidebarList;
