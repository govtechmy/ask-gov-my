import React from "react";
import { getAgencyListWithPagination } from "@/actions/questionServices";

interface ManageAgenciesProps {
  searchParams: {
    page?: string;
    searchTerm?: string;
  };
}

const ManageAgencies: React.FC<ManageAgenciesProps> = async ({
  searchParams,
}) => {
  const currentPage = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const searchTerm = searchParams.searchTerm || "";

  const { data } = await getAgencyListWithPagination(
    currentPage,
    27,
    searchTerm
  );

  return (
    <div className="container max-w-screen-lg pt-3 mx-auto">
      <div>TEMP AGENCY ADMIN PAGE</div>
    </div>
  );
};

export default ManageAgencies;
