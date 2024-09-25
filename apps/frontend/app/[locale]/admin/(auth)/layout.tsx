import BaseHeader from '@/components/common/Header/BaseHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <BaseHeader isAdmin></BaseHeader>
      {children}
    </div>
  );
}
