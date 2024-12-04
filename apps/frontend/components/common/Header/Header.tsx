"use client";

import React from "react";
import Info from "@/icons/info";
import SearchBar from "./SearchBar";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n";
import RightArrow from "@/icons/rightarrow";
import { Agency } from "@/types/types";
import AgencyName from "../AgencyName";
import AgencyLogoImporter from "../AgencyLogoImporter";
import { useSearchBar } from "@/components/context/SearchBarContext";
import { cn } from "@askgovmy/utils";
import { route } from "@/lib/routes";
import { useParams } from "next/navigation";

interface HeaderProps {
  agency?: Agency;
}

const Header: React.FC<HeaderProps> = ({ agency }) => {
  const t = useTranslations("Search");
  const { headerSearchInputRef, isNavbarSearchInputVisible } = useSearchBar();
  const params = useParams();

  const renderTitle = () => {
    if (agency) {
      return (
        <>
          <div className="flex items-center gap-1">
            <Link href={route("home", params)}>
              <div className="font-medium text-dim-500 text-sm">Home</div>
            </Link>
            <div>
              <RightArrow className="stroke-outline-400" />
            </div>
            <div className="font-medium text-black-800 text-sm">
              {agency.acronym.toUpperCase()}
            </div>
          </div>
          <div className="flex items-center pb-6 pt-3 text-2xl text-left">
            <div className="flex-shrink-0 flex items-center justify-center relative h-[42px] w-[42px]">
              <AgencyLogoImporter currentAgency={agency} />
            </div>
            <div
              id="search-navbar-title"
              className="font-poppins text-black-900 font-semibold text-2xl px-3"
            >
              <AgencyName agency={agency} />
            </div>
          </div>
        </>
      );
    } else {
      return (
        <div
          id="search-navbar-title"
          className="font-poppins pb-6 text-2xl font-semibold text-[#482D7C] dark:text-[#FFFFFF] text-center"
        >
          {t("title")}
        </div>
      );
    }
  };

  return (
    <div
      className={`flex items-center bg-gradient-radial from-[#D4C0FF] to-[#F4EFFF] dark:from-[#4F1FB4] dark:to-[#201636] px-4.5 md:px-0 py-12`}
    >
      <div className="container flex flex-col">
        {renderTitle()}
        <div
          className={`relative flex ${!agency ? "justify-center w-full" : ""}`}
        >
          <SearchBar
            ref={headerSearchInputRef}
            className={cn("max-w-[780px] z-10")}
            agencyUUID={agency?.id.toString()}
            hideResultsPopup={isNavbarSearchInputVisible}
            scrollOnFocus
          />
        </div>
        {!agency && (
          <div className="flex items-start md:items-center  md:justify-center justify-start mt-3 md:gap-1.5">
            <Info className="text-[#766695]" />
            <p className="text-center text-sm font-medium text-[#766695] flex-1 md:flex-initial">
              {t("reminder")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
