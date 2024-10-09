import React from "react";
import { cn } from "@askgovmy/utils";
import { AskLogoIcon, StyledDisplay } from "@askgovmy/ui";
import { Link } from "@/lib/i18n";
import { route } from "@/lib/routes";
import ThemeToggle from "@/components/layout/header/theme-toggle";
import LocaleSwitch from "@/components/layout/header/locale-switch";
import UserPopover from "@/components/layout/header/user-popover";
import NavLinks from "@/components/layout/header/nav-links";
import { FSP, inject } from "@/lib/decorator";
import MustBeAuthenticated from "@/middlewares/injectors/must-be-authenticated";
import MobileSheet from "@/components/layout/header/mobile-sheet";

const AdminHeader: FSP = ({ params }) => {
  return (
    <header className="sticky top-0 z-50 bg-background lg:backdrop-blur-[30px] print:hidden">
      <div
        className={cn(
          "max-w-screen-lg mx-auto w-full px-4 lg:px-0 flex py-6 gap-4.5 items-center"
          // showMenu ? "" : "xl:bg-transparent"
        )}
        data-nosnippet
      >
        <div className="flex-1 flex gap-5">
          <Link
            href={route("home", params)}
            className="flex items-center gap-2.5"
          >
            <AskLogoIcon />
            <p className="font-poppins text-black-900 text-lg font-semibold hidden lg:block">
              AskMyGov
            </p>
            <StyledDisplay variant={"nameHeader"}>ADMIN</StyledDisplay>
          </Link>
          <NavLinks />
        </div>
        <div className="flex gap-2 items-center">
          <ThemeToggle />
          <LocaleSwitch />
          <UserPopover />
          <MobileSheet />
        </div>
      </div>
    </header>
  );
};

export default inject(AdminHeader, {
  middleware: [MustBeAuthenticated],
});
