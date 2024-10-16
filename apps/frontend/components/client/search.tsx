"use client";
import { routes } from "@/lib/routes";
import { FunctionComponent } from "react";
import { CloseIcon, Input, SearchIcon } from "@askgovmy/ui";
import { cn, debounce } from "@askgovmy/utils";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { DeepKeys } from "@/types/types";
import { usePathname } from "@/lib/i18n";
import i18nKeys from "@/messages/en-GB.json";
import { useTranslations } from "next-intl";
import { TranslationNamespace } from "./translator";

interface SearchProps {
  className?: string;
  placeholder?: TranslationNamespace;
  route: DeepKeys<typeof routes>;
}

const Search: FunctionComponent<SearchProps> = ({
  route: _route,
  placeholder = "Taip untuk cari",
  className,
}) => {
  const t = useTranslations();
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const text = searchParams.get("search");

  const onSearch = debounce((event) => {
    const query = event.target.value;
    const sp = new URLSearchParams(searchParams);

    if (sp.get("page")) sp.set("page", "1");
    if (query) {
      sp.set("search", query.toLowerCase());
    } else {
      sp.delete("search");
    }
    replace(`${pathname}?${sp.toString()}`, { scroll: false });
  }, 300);

  return (
    <Input
      id="search-input"
      suffix={
        text ? (
          <CloseIcon
            className=""
            onClick={() => {
              const element = document.getElementById(
                "search-input"
              ) as HTMLInputElement;
              const sp = new URLSearchParams(searchParams);
              if (sp.get("page")) sp.set("page", "1");
              sp.delete("search");
              element.value = "";
              replace(`${pathname}?${sp.toString()}`, { scroll: false });
            }}
          />
        ) : (
          <SearchIcon className="h-4 w-4 text-outline-400" />
        )
      }
      defaultValue={text || ""}
      placeholder={t(placeholder)}
      className={cn(
        "rounded-lg h-8 px-2.5 py-1.5 w-full lg:w-[250px]",
        className
      )}
      onChange={onSearch}
    />
  );
};

export default Search;
