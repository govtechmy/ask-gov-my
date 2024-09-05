import AdminHeaderDashboard from '@/components/common/Header/AdminHeaderDashboard';
import Providers from '../../providers/providers';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <Providers>
      <AdminHeaderDashboard></AdminHeaderDashboard>
      {children}
      </Providers>
    </>
  );
}
