import HeaderDashboard from '@/components/HeaderDetails/HeaderDashboard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderDashboard />
      {children}
    </>
  );
}
