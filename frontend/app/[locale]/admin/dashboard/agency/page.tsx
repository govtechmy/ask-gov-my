import React from 'react';
import { getAgencyListWithPagination } from '@/actions/questionServices';
import AgencyNavbar from '@/components/AdminDashboard/AgencyNavbar';
import AgencyBox from '@/components/AdminDashboard/AgencyBox';

interface ManageAgenciesProps {
  searchParams: {
    page?: string;
    searchTerm?: string;
  };
}

const ManageAgencies: React.FC<ManageAgenciesProps> = async ({ searchParams }) => {
  const currentPage = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const searchTerm = searchParams.searchTerm || '';

  const { agencies, totalPages } = await getAgencyListWithPagination(currentPage,27, searchTerm);

  return (
    <div className="container max-w-screen-lg pt-3 mx-auto">
      <AgencyNavbar searchTerm={searchTerm}/>
      <AgencyBox
        agencies={agencies}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  );
};

export default ManageAgencies;
