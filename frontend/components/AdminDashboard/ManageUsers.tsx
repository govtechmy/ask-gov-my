'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAllUsers } from '@/actions/userServices';
import { getAgencyList } from '@/actions/questionServices';
import UserNavbar from './UserNavbar';
import UserCard from './UserCard';
import RightArrow from '@/icons/rightarrow';
import LeftArrow from '@/icons/leftarrow';
import { Agency, User } from '@/types/types';

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'all';

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      if (response.success) {
        setUsers(response.users || []);
        setFilteredUsers(response.users || []);
      } else {
        setError(response.message || 'Failed to fetch users');
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAgencies = async () => {
    try {
      const agencyList = await getAgencyList();
      setAgencies(agencyList);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Failed to fetch agencies:', error.message);
      } else {
        console.error('An unknown error occurred while fetching agencies');
      }
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAgencies();
  }, []);

  useEffect(() => {
    let results = users;
    if (tab === 'superadmin') {
      results = users.filter(user => user.role === 'super_admin');
    } else if (tab === 'staff') {
      results = users.filter(user => user.role === 'staff');
    }
    if (searchTerm) {
      results = results.filter(
        user =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    setFilteredUsers(results);
    setCurrentPage(1);
  }, [searchTerm, users, tab]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];

    pageNumbers.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        className={`rounded-lg h-8 w-7 ${currentPage === 1 ? 'bg-[#F4EFFF] text-[#702FF9]' : 'bg-transparent text-black-700'}`}
      >
        {1}
      </button>,
    );

    if (currentPage > 1) {
      pageNumbers.push(
        <span key="ellipsis-start" className="px-2 py-2">
          ...
        </span>,
      );
    }

    let startPage, endPage;
    if (currentPage <= 2) {
      startPage = 2;
      endPage = Math.min(4, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - 3);
      endPage = totalPages - 1;
    } else {
      startPage = Math.max(2, currentPage - 1);
      endPage = Math.min(currentPage + 1, totalPages - 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`rounded-lg h-8 w-7 ${i === currentPage ? 'bg-[#F4EFFF] text-[#702FF9]' : 'bg-transparent text-black-700'}`}
        >
          {i}
        </button>,
      );
    }

    if (currentPage < totalPages - 2) {
      pageNumbers.push(
        <span key="ellipsis-end" className="px-2 py-2 rounded-lg">
          ...
        </span>,
      );
    }

    if (totalPages > 1) {
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`rounded-lg h-8 w-7 ${totalPages === currentPage ? 'bg-[#F4EFFF] text-[#702FF9]' : 'bg-transparent text-black-700'}`}
        >
          {totalPages}
        </button>,
      );
    }

    return <div className="flex rounded items-center">{pageNumbers}</div>;
  };

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIdx, endIdx);

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container max-w-screen-lg pt-3 mx-auto px-6">
      <UserNavbar
        setSearchTerm={setSearchTerm}
        agencies={agencies}
        onAddUser={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
      {/* userNavbar prop didnt pass properly, something leftover, either make it as alternative or needed */}
      <div className="h-6"></div>
      {filteredUsers.length === 0 ? (
        <p className="text-center">
          We couldn't find any users. Please try searching again using the
          search bar above.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-2">
            {currentUsers.map(user => (
              <UserCard
                key={user.id}
                user={user}
                onUpdate={fetchUsers}
                agencies={agencies}
              />
            ))}
          </div>
          <div className="mt-4 rounded-lg flex items-center justify-center pb-7">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`rounded-lg h-8 w-8 bg-white shadow-button text-black-900 border-[1px] border-[#E4E4E7] ${currentPage === 1 ? ' opacity-30' : 'opacity-100'}`}
            >
              <div className="h-8 w-8 rounded-lg flex items-center justify-center">
                <div className="flex items-center justify-center h-4 w-4">
                  <LeftArrow />
                </div>
              </div>
            </button>

            <div className="rounded-lg p-3">{renderPageNumbers()}</div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`rounded-lg h-8 w-8 bg-white shadow-button text-black-900 border-[1px] border-[#E4E4E7] ${currentPage === totalPages ? ' opacity-30' : 'opacity-100'}`}
            >
              <div className="h-8 w-8 rounded-lg flex items-center justify-center">
                <div className="flex items-center justify-center h-4 w-4">
                  <RightArrow />
                </div>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageUsers;
