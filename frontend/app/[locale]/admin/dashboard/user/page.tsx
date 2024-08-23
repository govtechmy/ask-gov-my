'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getAllUsers } from '@/actions/userServices';
import { getAgencyList } from '@/actions/questionServices';
import { Agency, User } from '@/types/types';
import UserNavbar from '@/components/AdminDashboard/UserNavbar';
import UserCard from '@/components/AdminDashboard/UserCard';
import Pagination from '@/components/ui/pagination';

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
  const [paginatedUsers, setPaginatedUsers] = useState<Agency[]>([]);

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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={filteredUsers.length}
            setPaginatedItems={setPaginatedUsers}
            items={filteredUsers}
          />
        </>
      )}
    </div>
  );
};

export default ManageUsers;
