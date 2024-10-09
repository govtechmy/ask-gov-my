"use client";
import { Link, usePathname } from "@/lib/i18n";
import {
  Button,
  HamburgerMenuIcon,
  XIcon,
  Sheet,
  SheetClose,
  SheetContent,
  SheetOverlay,
  SheetPortal,
  GovIcon,
  QuestionCircleIcon,
  UserGroupIcon,
  buttonVariants,
  Separator,
  LogoutIcon,
  Avatar,
} from "@askgovmy/ui";
import { cn } from "@askgovmy/utils";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { FC, useState } from "react";

interface NavLinkProps {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
}

const MobileSheet: FC = () => {
  const t = useTranslations();
  const [showMenu, setMenu] = useState<boolean>(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const handleLogout = () => signOut();

  if (!session) return;

  const navLinks: NavLinkProps[] = [
    {
      href: "/admin/dashboard",
      icon: QuestionCircleIcon,
      label: t("Nav.Header.questions"),
    },
    {
      href: "/admin/dashboard/agency",
      icon: GovIcon,
      label: t("Nav.Header.agencies"),
    },
    {
      href: "/admin/dashboard/user",
      icon: UserGroupIcon,
      label: t("Nav.Header.users"),
    },
  ];

  return (
    <div className="flex items-center lg:hidden">
      <Button
        variant="tertiary"
        className={cn("p-2.5", showMenu && "bg-washed-100")}
        onClick={() => setMenu(!showMenu)}
      >
        {showMenu ? <XIcon /> : <HamburgerMenuIcon />}
      </Button>
      <Sheet open={showMenu} onOpenChange={setMenu}>
        <SheetContent
          side="top"
          className="absolute top-full -z-10 flex flex-col gap-1 rounded-b-xl p-3 xl:hidden"
        >
          <div className="flex items-center gap-2.5">
            <Avatar
              src={session?.user.image || undefined}
              name={session.user.name || session.user.email}
            />
            <div className="flex flex-col flex-1 gap-0.5">
              <h6 className="font-medium text-sm text-black-700">
                {session.user.name}
              </h6>
              <p className="text-sm text-dim-500">
                {t(`Role.${session.user.role}`)}
              </p>
            </div>
          </div>

          <Separator className="my-2.5" />

          {navLinks.map((link) => (
            <SheetClose asChild key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  buttonVariants({
                    variant: "tertiary",
                    size: "lg",
                  }),
                  "font-medium items-center justify-start w-full",
                  pathname === link.href
                    ? "text-black-900 bg-gray-100"
                    : "text-black-700"
                )}
              >
                {<link.icon className="stroke-current" />}
                {link.label}
              </Link>
            </SheetClose>
          ))}

          <Separator className="my-2.5" />
          <SheetClose asChild>
            <Button
              onClick={handleLogout}
              variant={"tertiary-dropdown"}
              size={"lg"}
              className="text-foreground-danger"
            >
              <LogoutIcon className="stroke-foreground-danger" />
              Logout
            </Button>
          </SheetClose>
        </SheetContent>
        <SheetPortal>
          <SheetOverlay className="z-40" />
        </SheetPortal>
      </Sheet>
    </div>
  );
};

export default MobileSheet;
