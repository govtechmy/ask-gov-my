import { useTranslations } from 'next-intl';
import ManageQuestions from '@/components/AdminDashboard/ManageQuestions';
import StaffHeaderDashboard from '@/components/common/Header/StaffHeaderDashboard';
import StaffManageQuestions from '@/components/AdminDashboard/StaffManageQuestion';

interface DashboardPageProps {
  searchParams: { [key: string]: string | undefined };
}

export default function DashboardPage({ searchParams }: DashboardPageProps) {
  const t = useTranslations('Adminlogin');

  let role = 'super_admin';

  return (
    <div className="">
      <div className="">
        {role === 'super_admin' ? (
          <>
            <ManageQuestions searchParams={searchParams} />
          </>
        ) : (
          <>
            <StaffHeaderDashboard />
            <StaffManageQuestions />
          </>
        )}
      </div>
    </div>
  );
}
