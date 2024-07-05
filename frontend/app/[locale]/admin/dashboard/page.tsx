import { useTranslations } from 'next-intl';
import HeaderDashboard from '@/components/HeaderDetails/HeaderDashboard';
import AdminNavbar from '@/components/AdminNavbar';

export function DashboardPage() {
  const t = useTranslations('Adminlogin');

  return (
    <div className="flex flex-col min-h-screen pt-5">
      <div className="mx-[10%]">
        <HeaderDashboard />
        <AdminNavbar />
        <div className="flex-grow flex items-center justify-center py-12">
          HELLOO WORLDOOOO
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
