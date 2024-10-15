"use client";
import { Link, usePathname } from "@/lib/i18n";
import { FC } from "react";
import { cn } from "@askgovmy/utils";
import { useSession } from "next-auth/react";
import {
  buttonVariants,
  GovIcon,
  QuestionCircleIcon,
  UserGroupIcon,
} from "@askgovmy/ui";
import { useTranslations } from "next-intl";

interface NavLinkProps {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
}

const NavLinks: FC = () => {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session) {
    return;
  }

  const navLinks: NavLinkProps[] = [
    {
      href: "/admin/dashboard",
      icon: QuestionCircleIcon,
      label: t("Header.questions"),
    },
    {
      href: "/admin/dashboard/agency",
      icon: GovIcon,
      label: t("Header.agencies"),
    },
    {
      href: "/admin/dashboard/user",
      icon: UserGroupIcon,
      label: t("Header.users"),
    },
  ];

  const userRole = session.user.role;

  return (
    <>
      {userRole === "super_admin" && (
        <div className="items-center hidden lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                buttonVariants({
                  variant: "tertiary-askmygov",
                  size: "sm",
                }),
                "font-medium",
                pathname === link.href
                  ? "text-askmygovtextbrand-600 bg-askmygovbrand-50"
                  : "text-black-700"
              )}
            >
              {<link.icon className="stroke-current" />}
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default NavLinks;
