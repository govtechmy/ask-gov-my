import { LoginForm } from "@/app/[locale]/admin/(auth)/login-form";
import { FSP, inject } from "@/lib/decorator";
import RedirectIfAuthenticated from "@/middlewares/injectors/redirect-if-authenticated";

const AdminPage: FSP = () => {
  return <LoginForm />;
};

export default inject(AdminPage, {
  // debug: true,
  middleware: [RedirectIfAuthenticated],
});
