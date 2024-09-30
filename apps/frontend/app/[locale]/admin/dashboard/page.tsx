import StaffHeaderDashboard from "@/components/common/Header/StaffHeaderDashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

interface DashboardPageProps {
  searchParams: { [key: string]: string | undefined };
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const session = await getServerSession(authOptions);
  let role;
  if (session) {
    role = session.user.role;
  }
  return (
    <div className="">
      <div className="">
        <div>THIS IS TEMP ADMIN DASHBOARD</div>
        {/* {role === "super_admin" ? (
          <>
            <ManageQuestions searchParams={searchParams} />
          </>
        ) : (
          <>
            <StaffManageQuestions searchParams={searchParams} />
          </>
        )} */}
      </div>
    </div>
  );
}
