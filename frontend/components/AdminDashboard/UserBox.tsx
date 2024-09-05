'use client';

import React from 'react';
import { User, Agency } from '@/types/types';
import UserCard from '@/components/AdminDashboard/UserCard';
import Pagination from '@/components/ui/pagination';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/lib/i18n';

interface UserBoxProps {
  data: {
    users: User[];
    currentPage: number;
    totalPages: number;
  };
  agencies: Agency[];
}

const UserBox: React.FC<UserBoxProps> = ({ data, agencies }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= data.totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', page.toString());
      router.push(`${window.location.pathname}?${params.toString()}`);
    }
  };

  return (
    <div>
      {data.users.length === 0 ? (
        <p className="text-center">
          We couldn't find any users. Please try searching again using the search bar above.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-2">
            {data.users.map(user => (
              <UserCard
                key={user.id}
                user={user}
                agencies={agencies}
                onUpdate={() => handlePageChange(data.currentPage)}
              />
            ))}
          </div>
          <Pagination
            currentPage={data.currentPage}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default UserBox;
