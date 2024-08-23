'use client';

import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import ManageQuestions from '@/components/AdminDashboard/ManageQuestions';
import { useState } from 'react';
import StaffHeaderDashboard from '@/components/common/Header/StaffHeaderDashboard';
import StaffManageQuestions from '@/components/AdminDashboard/StaffManageQuestion';
import AdminHeaderDashboard from '@/components/common/Header/AdminHeaderDashboard';

export default function DashboardPage() {
  const t = useTranslations('Adminlogin');
  const session = useSession();

  // State to manage the selected role
  const [role, setRole] = useState<'super_admin' | 'staff'>('super_admin');

  if (session.status === 'loading') {
    return <p>LOADING...</p>;
  }

  // if (session.status !== 'authenticated') {
  //   router.push('/admin');
  //   return <p>goodbye</p>;
  // }

  // Handle role change
  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(event.target.value as 'super_admin' | 'staff');
  };

  return (
    <div className="">
      <div className="">
        <select
          value={role}
          onChange={handleRoleChange}
          className="mb-4 p-2 border rounded"
        >
          <option value="super_admin">Super Admin</option>
          <option value="staff">Staff</option>
        </select>

        {role === 'super_admin' ? (
          <>
            <ManageQuestions />
          </>
        ) : (
          <>
            <StaffHeaderDashboard />
            <StaffManageQuestions />
          </>
        )}
      </div>
    </div>
  );
}

//helper to check for role
