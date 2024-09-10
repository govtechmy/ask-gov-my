import Providers from '../../providers/providers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import AdminHeaderDashboard from '@/components/common/Header/AdminHeaderDashboard';
import StaffHeaderDashboard from '@/components/common/Header/StaffHeaderDashboard';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  let role;
  if (session) {
    role = session.user.role;
  }

  return (
    <>
      <Providers>
        {role === 'super_admin' ? (
          <AdminHeaderDashboard />
        ) : (
          <StaffHeaderDashboard />
        )}
        {children}
      </Providers>
    </>
  );
}
