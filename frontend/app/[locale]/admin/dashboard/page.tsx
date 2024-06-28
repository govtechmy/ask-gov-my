import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Google from '@/icons/google';
import { useTranslations } from 'next-intl';
import HeaderDashboard from '@/components/HeaderDetails/HeaderDashboard';

export function DashboardPage({ locale }: { locale: string }) {
  const t = useTranslations('Adminlogin');

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderDashboard locale={locale} />
      <div className="flex-grow flex items-center justify-center py-12">
        HELLOO WORLDOOOO
      </div>
    </div>
  );
}

export default DashboardPage;
