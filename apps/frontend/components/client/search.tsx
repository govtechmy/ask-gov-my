"use client";
import { routes } from "@/lib/routes";
import { FunctionComponent } from "react";
import { Input, SearchIcon } from "@askgovmy/ui";
import { cn, debounce } from "@askgovmy/utils";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { DeepKeys } from "@/types/types";
import { usePathname } from "@/lib/i18n";
import i18nKeys from "@/messages/en-GB.json";
import { useTranslations } from "next-intl";

interface SearchProps {
  className?: string;
  placeholder?: DeepKeys<typeof i18nKeys>;
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
      suffix={<SearchIcon className="h-4 w-4 text-outline-400" />}
      defaultValue={searchParams.get("search") || ""}
      placeholder={t(placeholder)}
      className={cn("rounded-lg h-8 px-2.5 py-1.5 w-[250px]", className)}
      onChange={onSearch}
    />
  );
};

export default Search;
