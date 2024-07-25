'use client';

import { useTranslations } from 'next-intl';
import HeaderDashboard from '@/components/HeaderDetails/HeaderDashboard';
import { useSession } from 'next-auth/react';
import { useRouter } from '@/lib/i18n';
import { useSearchParams } from 'next/navigation';
import ManageQuestions from '@/components/AdminDashboard/ManageQuestions';
import ManageAgencies from '@/components/AdminDashboard/ManageAgencies';
import ManageUsers from '@/components/AdminDashboard/ManageUsers';
import { useState } from 'react';
import StaffHeaderDashboard from '@/components/HeaderDetails/StaffHeaderDashboard';
import StaffManageQuestions from '@/components/AdminDashboard/StaffManageQuestion';

export default function DashboardPage() {
  const t = useTranslations('Adminlogin');
  const session = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || 'questions';

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
            <HeaderDashboard />
            {page === 'questions' && <ManageQuestions />}
            {page === 'manageagencies' && <ManageAgencies />}
            {page === 'manageusers' && <ManageUsers />}
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
