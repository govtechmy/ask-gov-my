import { useTranslations } from 'next-intl';
import HeaderDashboard from '@/components/HeaderDetails/HeaderDashboard';
import AdminNavbar from '@/components/AdminNavbar';

export function DashboardPage({ locale }: { locale: string }) {
  const t = useTranslations('Adminlogin');

  return (
    <div className="flex flex-col min-h-screen pt-5">
      {/* check background color! */}
      <div className="mx-[10%]">
        <HeaderDashboard locale={locale} />
        <AdminNavbar />
        <div className="flex-grow flex items-center justify-center py-12">
          HELLOO WORLDOOOO
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
