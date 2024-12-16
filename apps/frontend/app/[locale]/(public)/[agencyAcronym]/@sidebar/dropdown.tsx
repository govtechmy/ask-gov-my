"use client";
import { useRouter } from "@/lib/i18n";
import { route } from "@/lib/routes";
import { Topic } from "@/types/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectIcon,
  Button,
  ChevronDownIcon,
} from "@askgovmy/ui";
import { cn } from "@askgovmy/utils";
import { useTranslations } from "next-intl";
import { FC } from "react";

interface TopicSidebarDropdownProps {
  params?: Record<string, any>;
  topics: Topic[];
}

const TopicSidebarDropdown: FC<TopicSidebarDropdownProps> = ({
  params,
  topics,
}) => {
  const t = useTranslations("Topics");
  const router = useRouter();

  const dropdownValue = params?.topicId;
  const selectedTopic =
    dropdownValue !== "all"
      ? topics.find((topic) => topic.id === dropdownValue)
      : undefined;

  const handleValueChange = (selected: string) => {
    if (selected === "all") {
      router.replace(route("agencyTopic", { ...params, topicId: "all" }));
      return;
    }
    router.replace(route("agencyTopic", { ...params, topicId: selected }));
  };

  return (
    <div className="block lg:hidden">
      <Select value={dropdownValue} onValueChange={handleValueChange}>
        <SelectTrigger asChild>
          <Button
            variant="secondary"
            className="h-8 text-sm focus:outline-none overflow-hidden sm:w-fit w-full justify-start"
          >
            <span className="text-sm text-dim-500"> {t("topic")}: </span>
            <SelectValue>
              {dropdownValue === "all"
                ? t("alltopics")
                : params?.locale === "ms-MY"
                  ? selectedTopic?.title_ms
                  : selectedTopic?.title}
            </SelectValue>
            <SelectIcon>
              <ChevronDownIcon />
            </SelectIcon>
          </Button>
        </SelectTrigger>
        <SelectContent
          side="bottom"
          className="max-h-[250px] w-full py-2"
          align="start"
        >
          <SelectItem
            value={"all"}
            className={t("alltopics") === dropdownValue ? "font-medium" : ""}
          >
            {t("alltopics")}
          </SelectItem>
          {topics.map((topic) => (
            <SelectItem
              key={topic.id}
              value={topic.id.toString()}
              className={cn(
                topic.id.toString() === dropdownValue ? "font-medium" : ""
              )}
            >
              {params?.locale === "ms-MY" ? topic.title_ms : topic.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TopicSidebarDropdown;
