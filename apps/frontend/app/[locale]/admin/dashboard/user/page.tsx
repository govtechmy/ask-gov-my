import React from "react";
import { getAllUsers } from "@/actions/userServices";
import { getAgencyList, getDynamicAgencyMap } from "@/actions/questionServices";
import { Agency, User } from "@/types/types";

interface ManageUsersProps {
  searchParams: {
    page?: string;
    tab?: string;
    searchTerm?: string;
    agencyId?: string;
  };
}

const ManageUsers = async ({ searchParams }: ManageUsersProps) => {
  const currentPage = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const currentTab = searchParams.tab || "all";
  const searchTerm = searchParams.searchTerm || "";
  const agencyId = searchParams.agencyId || "";
  const { data } = await getAllUsers({
    page: currentPage,
    tab: currentTab,
    searchTerm,
    agencyId,
  });
  const agencies = await getAgencyList();
  return (
    <div className="container max-w-screen-lg pt-3 mx-auto px-6">
      <div>TEMP ADMIN USER PAGE</div>
    </div>
  );
};

export default ManageUsers;
