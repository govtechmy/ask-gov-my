import React from 'react';
import { getAllUsers } from '@/actions/userServices';
import { getAgencyList, getDynamicAgencyMap } from '@/actions/questionServices';
import UserNavbar from '@/components/AdminDashboard/UserNavbar';
import UserBox from '@/components/AdminDashboard/UserBox';
import { Agency, User } from '@/types/types';

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
  const currentTab = searchParams.tab || 'all';
  const searchTerm = searchParams.searchTerm || '';
  const agencyId = searchParams.agencyId || '';
  const agencyMap = getDynamicAgencyMap()
  const { users, totalPages } = await getAllUsers({
    page: currentPage,
    tab: currentTab,
    searchTerm,
    agencyId,
  });
  const agencies = await getAgencyList();

  return (
    <div className="container max-w-screen-lg pt-3 mx-auto px-6">
      <UserNavbar
        agencies={agencies}
      />
      <div className="h-6"></div>
      <UserBox
        users={users}
        agencies={agencies}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default ManageUsers;
