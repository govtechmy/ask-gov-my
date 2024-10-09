import AdminHeaderDashboard from "@/components/common/header/AdminHeaderDashboard";
import StaffHeaderDashboard from "@/components/common/header/StaffHeaderDashboard";

const Layout = ({ children, header }) => {
  let role = "super_admin";
  return (
    <>
      {/* {role === "super_admin" ? (
        <AdminHeaderDashboard />
      ) : (
        <StaffHeaderDashboard />
      )} */}
      {header}
      {children}
    </>
  );
};

export default Layout;
