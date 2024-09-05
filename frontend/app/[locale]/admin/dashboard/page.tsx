import ManageQuestions from '@/components/AdminDashboard/ManageQuestions';
import StaffHeaderDashboard from '@/components/common/Header/StaffHeaderDashboard';
import StaffManageQuestions from '@/components/AdminDashboard/StaffManageQuestion';

interface DashboardPageProps {
  searchParams: { [key: string]: string | undefined };
}

export default function DashboardPage({ searchParams }: DashboardPageProps) {

  let role = 'super_admin'; //user role will be extracted from user.role in real scenario

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
            <StaffManageQuestions searchParams={searchParams} />
          </>
        )}
      </div>
    </div>
  );
}
