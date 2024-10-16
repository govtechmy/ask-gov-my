"use client";

import Translator, {
  TranslationNamespace,
} from "@/components/client/translator";
import Search from "@/components/client/search";
import {
  Button,
  PlusIcon,
  Tabs,
  TabsList,
  TabsTrigger,
  SelectIcon,
  ChevronDownIcon,
  Popover,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@askgovmy/ui";
import { FC, startTransition } from "react";
import { cn, RoleList } from "@askgovmy/utils";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/lib/i18n";
import { Agency } from "@/types/types";
import { Check } from "lucide-react";

interface ManageUsersHeader {
  agencies: Agency[];
}

const ManageUsersHeader: FC<ManageUsersHeader> = ({ agencies }) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const roles = ["all", ...RoleList];
  const dropdownValue = searchParams.get("agency") || "all";
  const selectedAgency =
    dropdownValue !== "all"
      ? agencies.find((agency) => agency.id.toString() === dropdownValue)
      : undefined;

  const onSelectChange = (value: string, param: "role" | "agency") => {
    const sp = new URLSearchParams(searchParams);
    if (sp.get("page")) sp.set("page", "1");
    sp.set(param, value);
    startTransition(() => {
      replace(`${pathname}?${sp.toString()}`, { scroll: false });
    });
  };
  return (
    <div className="flex flex-row lg:items-center gap-5 lg:gap-2 border-b flex-wrap pb-4.5 lg:pb-0">
      <Tabs
        defaultValue={roles[0]}
        value={searchParams.get("role") || "all"}
        onValueChange={(role) => onSelectChange(role, "role")}
        className="flex-1"
      >
        <TabsList className="gap-5 rounded-lg h-[46px]">
          {roles.map((role) => {
            const key = `Role.${role}` as TranslationNamespace;
            return (
              <TabsTrigger
                key={role}
                className="text-dim-500 pb-2 text-sm h-full rounded-none bg-background data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 border-askmygovbrand-600"
                value={role}
              >
                <Translator namespace={key} />
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
      <div className="flex self-start gap-2">
        <Popover
          trigger={
            <Button
              id="agency-dropdown"
              variant="secondary"
              className="h-8 text-sm focus:outline-none overflow-hidden w-fit lg:w-full justify-start pr-8 sm:pr-2"
            >
              <Translator
                namespace="AdminUsers.agency"
                className="text-sm text-dim-500"
              />

              {dropdownValue === "all" ? (
                <Translator namespace="AdminUsers.all_agency" tag="span" />
              ) : (
                selectedAgency?.acronym
              )}

              <SelectIcon>
                <ChevronDownIcon />
              </SelectIcon>
            </Button>
          }
          option={{ side: "bottom", align: "start", sideOffset: 8 }}
        >
          {(setOpen) => (
            <Command
              filter={(value, _search) => {
                const search = _search.toLowerCase();
                if (value === "all") return value.includes(search) ? 1 : 0;
                const item = agencies.find(
                  (agency) => agency.id.toString() === value
                );
                return item?.name.toLowerCase().includes(search) ||
                  item?.acronym.toLowerCase().includes(search)
                  ? 1
                  : 0;
              }}
            >
              <CommandInput placeholder="Search" />
              <CommandList className="w-[320px]">
                <CommandEmpty>
                  <Translator
                    namespace="AdminAgencies.not_found"
                    className="max-w-[320px]"
                  />
                </CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value={"all"}
                    onSelect={(agency) => {
                      onSelectChange(agency, "agency");
                      setOpen(false);
                    }}
                    className="gap-2"
                  >
                    <Translator
                      className="font-medium flex-1"
                      namespace="AdminUsers.all_agency"
                    />
                    {/* <span className="font-medium">{agency.acronym}</span> */}

                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 text-askmygovbrand-600",
                        dropdownValue === "all" ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                  {agencies.map((agency) => (
                    <CommandItem
                      key={agency.id}
                      value={agency.id.toString()}
                      onSelect={(agency) => {
                        onSelectChange(agency, "agency");
                        setOpen(false);
                      }}
                      className="gap-2"
                    >
                      <span className="font-medium">{agency.acronym}</span>
                      <span className="flex-1 w-full line-clamp-1 text-dim-500">
                        {agency.name}
                      </span>
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 text-askmygovbrand-600",
                          dropdownValue === agency.id.toString()
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          )}
        </Popover>

        <Search
          route="admin.dashboard.user"
          placeholder="AdminUsers.search_placeholder"
          className="w-full"
        />
        <Button
          variant={"primary"}
          size={"sm"}
          icon={<PlusIcon className="stroke-white-forcewhite" />}
        >
          <Translator
            className="hidden md:block"
            namespace="AdminUsers.add_new"
          />
        </Button>
      </div>
    </div>
  );
};

export default ManageUsersHeader;
