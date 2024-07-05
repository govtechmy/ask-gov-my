'use client'

import { useTranslations } from 'next-intl';
import HeaderDashboard from '@/components/HeaderDetails/HeaderDashboard';
import AdminNavbar from '@/components/AdminNavbar';
import { useSession } from 'next-auth/react';
import { useRouter } from '@/lib/i18n';

export default function DashboardPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = useTranslations('Adminlogin');
  const session = useSession()
  const router = useRouter()
  
  if (session.status === 'loading') {
    return (
      <p>LOADING...</p>
    )
  }
  
  if (session.status != 'authenticated') {
    router.push('/admin')
    return (
      <p>goodbye</p>
    )
  }

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