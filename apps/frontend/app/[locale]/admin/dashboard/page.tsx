import { FSP, inject } from "@/lib/decorator";
import MustBeAuthenticated from "@/middlewares/injectors/must-be-authenticated";

const AdminDashboardPage: FSP = async ({}) => {
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
};

export default inject(AdminDashboardPage, {
  // debug: true,
  middleware: [MustBeAuthenticated],
});
