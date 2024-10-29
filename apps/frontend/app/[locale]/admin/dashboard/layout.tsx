import { unstable_setRequestLocale } from "next-intl/server";
import AdminHeader from "./@header/page";

const Layout = ({ children, params }) => {
  unstable_setRequestLocale(params.locale);
  return (
    <>
      <AdminHeader />
      <div className="container max-w-screen-lg mx-auto p-4.5 pt-0 lg:px-0">
        {children}
      </div>
    </>
  );
};

export default Layout;
