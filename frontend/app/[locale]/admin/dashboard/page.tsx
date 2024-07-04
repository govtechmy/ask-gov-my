'use client'
import { useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import HeaderDashboard from '@/components/HeaderDetails/HeaderDashboard';
import AdminNavbar from '@/components/AdminNavbar';

export default function DashboardPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = useTranslations('Adminlogin');

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        window.location.href = '/admin';
      }
    };

    checkSession();
  }, []);

  return (
    <div className="flex flex-col min-h-screen pt-5">
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