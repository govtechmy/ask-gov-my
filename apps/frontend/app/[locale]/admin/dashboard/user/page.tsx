import React from "react";
import { FSP, inject } from "@/lib/decorator";
import MustBeAuthenticated from "@/middlewares/injectors/must-be-authenticated";
import MustBeAuthorized from "@/middlewares/injectors/must-be-authorized";
import { default as Header } from "./header";
import { getUsers } from "@/actions/admin/user";
import { Agency, PageResult, User } from "@/types/types";
import {
  Avatar,
  Button,
  Empty,
  HoverCard,
  ThreeDottedIcon,
} from "@askgovmy/ui";
import Translator, {
  TranslationNamespace,
} from "@/components/client/translator";
import { cn } from "@askgovmy/utils";
import Image from "next/image";
import { Paginator } from "@/components/client/paginator";
import { getAgencies } from "@/actions/admin/agency";
import { EditUserDialog } from "./edit-user-dialog";
import { DeleteUserDialog } from "./delete-user-dialog";

interface ManageUsersProps {
  users: PageResult<User>;
  agencies: PageResult<Agency>;
}

const ManageUsers: FSP<ManageUsersProps> = async ({ data }) => {
  const { users, agencies } = data!;

  return (
    <div className="space-y-6">
      <Header agencies={agencies.results} />

      <Empty
        from={users.results}
        message={
          <Translator
            namespace="AdminUsers.not_found"
            className="text-dim-500 lg:w-[500px]"
          />
        }
      >
        <div className="grid grid-cols-1 gap-2">
          {users.results.map((user) => {
            const key = `Role.${user.role}` as TranslationNamespace;

            return (
              <div
                key={user.id}
                className="rounded-lg border border-outline-200 bg-white flex items-center gap-3 py-4 px-5 text-sm relative group hover:bg-background hover:border-outline-300 flex-wrap"
              >
                <Avatar
                  className="h-12 w-12"
                  src={user.image || undefined}
                  name={user.name || user.email}
                />
                <div className="flex-1 space-y-0.5">
                  <p className="text-base font-medium">{user.name}</p>
                  <p className="text-dim-500">{user.email}</p>
                </div>

                <div className="flex flex-row-reverse md:flex-row items-center gap-3">
                  {user.role === "staff" && user.agency && (
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded-full border border-outline-200 p-0.5">
                        <Image
                          alt={user.agency.name}
                          width={32}
                          height={32}
                          src={user.agency.logo_url || "/jata_logo.png"}
                          className="object-contain"
                        />
                      </div>
                      <p className="text-black-800 flex-1 lg:max-w-[350px] line-clamp-1">
                        {user.agency.name}
                      </p>
                    </div>
                  )}
                  <Translator
                    namespace={key}
                    tag="span"
                    className={cn(
                      "px-2 py-1 rounded-full font-medium",
                      user.role === "super_admin"
                        ? "bg-brand-50 text-mydstextbrand-600"
                        : "bg-washed-100 text-dim-500"
                    )}
                  />
                </div>

                <div className="absolute flex h-full w-14 right-5 bg-gradient-to-b from-background/0 to-background/100 justify-end py-4 transition-all items-center">
                  <HoverCard
                    trigger={
                      <Button
                        className="w-8 h-8 p-1.5 hover:cursor-pointer z-10 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 transition-opacity"
                        variant={"secondary"}
                        size={"sm"}
                        icon={
                          <ThreeDottedIcon className="w-4 h-4 stroke-black-700" />
                        }
                      />
                    }
                    option={{ align: "end", alignOffset: 0, sideOffset: 4 }}
                    className=""
                  >
                    <EditUserDialog
                      user={{
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        agency: user.agency?.id || null,
                      }}
                      agencies={agencies.results}
                    />
                    <DeleteUserDialog userId={user.id} />
                  </HoverCard>
                </div>
              </div>
            );
          })}
        </div>
      </Empty>

      {users.page.max > 1 && (
        <Paginator data={users.page} route="admin.dashboard.user" />
      )}
    </div>
  );
};

export default inject(ManageUsers, {
  // debug: true,
  middleware: [MustBeAuthenticated, MustBeAuthorized(["super_admin"])],
  async data({ searchParams, context }) {
    const { page = 1, search = "", role, agency } = searchParams;
    const { data: users } = await getUsers(
      {
        page,
        search,
        ...(role !== "all" && { role }),
        ...(agency !== "all" && { agency }),
      },
      context
    );

    const { data: agencies } = await getAgencies({ page_size: 999 }, context);

    return {
      users,
      agencies,
    };
  },
});
