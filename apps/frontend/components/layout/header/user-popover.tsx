"use client";

import {
  Button,
  ChevronDownIcon,
  LogoutIcon,
  Popover,
  UserIcon,
} from "@askgovmy/ui";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { FC } from "react";

const UserPopover: FC = ({}) => {
  const t = useTranslations();
  const { data: session } = useSession();
  const handleLogout = () => signOut();
  if (!session) return;

  return (
    <Popover
      trigger={
        <Button className="hidden lg:flex items-center gap-1 h-8" size={"sm"}>
          <UserIcon className="h-4 w-4" />
          <p className="font-medium text-sm">{session.user.name}</p>
          <p className="font-normal text-sm text-dim-500">
            {t(`Role.${session.user.role}`)}
          </p>
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      }
      option={{ align: "center", alignOffset: 0, sideOffset: 4 }}
      className="PopoverContent"
    >
      <Button
        onClick={handleLogout}
        variant={"tertiary-dropdown"}
        className="text-sm font-medium"
      >
        <LogoutIcon className="stroke-foreground-danger" />
        Logout
      </Button>
    </Popover>
  );
};

export default UserPopover;
