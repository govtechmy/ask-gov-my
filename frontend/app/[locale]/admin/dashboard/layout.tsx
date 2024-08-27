import AdminHeaderDashboard from '@/components/common/Header/AdminHeaderDashboard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminHeaderDashboard></AdminHeaderDashboard>
      {children}
    </>
  );
}
