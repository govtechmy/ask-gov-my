import React from "react";
import { FSP, inject } from "@/lib/decorator";
import MustBeAuthenticated from "@/middlewares/injectors/must-be-authenticated";
import MustBeAuthorized from "@/middlewares/injectors/must-be-authorized";
import { getAgencies } from "@/actions/admin/agency";
import { Agency, PageResult } from "@/types/types";
import Translator from "@/components/client/translator";
import Image from "next/image";
import { Paginator } from "@/components/client/paginator";
import { Button, GearIcon, PlusIcon, Empty } from "@askgovmy/ui";
import Search from "@/components/client/search";

interface ManageAgenciesProps {
  agencies: PageResult<Agency>;
}

const ManageAgencies: FSP<ManageAgenciesProps> = async ({ data }) => {
  const { agencies } = data!;
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-2">
        <Translator
          tag="h6"
          namespace="AdminAgencies.title"
          className="flex-1 text-lg font-inter"
        />
        <div className="flex items-center gap-2">
          <Search
            route="admin.dashboard.agency"
            placeholder="AdminAgencies.search_placeholder"
          />
          <Button
            variant={"primary"}
            size={"sm"}
            icon={<PlusIcon className="stroke-white-forcewhite" />}
          >
            <Translator namespace="AdminAgencies.add_new" />
          </Button>
        </div>
      </div>
      <Empty
        from={agencies.results}
        message={
          <Translator
            namespace="AdminAgencies.not_found"
            className="text-dim-500 lg:w-[500px]"
          />
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {agencies.results.map((agency) => (
            <div
              key={agency.id}
              className="border border-outline-200 bg-white h-16 px-4.5 gap-3 rounded-lg flex items-center relative group"
            >
              <div className="relative w-8 h-8 rounded-full border border-outline-200  p-0.5">
                <Image
                  alt={agency.name}
                  width={32}
                  height={32}
                  src={agency.logo_url || "/jata_logo.png"}
                  className="object-contain"
                />
              </div>
              <p className="line-clamp-2 flex-1 text-sm">{agency.name}</p>
              <div className="absolute h-full w-14 right-4.5 bg-gradient-to-b from-white to-white/100 hidden justify-end py-4 z-10 group-hover:flex transition-all">
                <Button
                  className="w-8 h-8 p-1.5 hover:cursor-pointer"
                  variant={"secondary"}
                  size={"sm"}
                  icon={<GearIcon className="w-4 h-4 stroke-black-700" />}
                />
              </div>
            </div>
          ))}
        </div>
      </Empty>

      {agencies.page.max > 1 && (
        <Paginator data={agencies.page} route="admin.dashboard.agency" />
      )}
    </div>
  );
};

export default inject(ManageAgencies, {
  // debug: true,
  middleware: [MustBeAuthenticated, MustBeAuthorized(["super_admin"])],
  async data({ searchParams, context }) {
    const { page = 1, search = "" } = searchParams;
    const { data } = await getAgencies({ page, search }, context);

    return {
      agencies: data,
    };
  },
});
