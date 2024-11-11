import { SearchBarContextProvider } from "@/components/context/SearchBarContext";
import Footer from "@/components/layout/footer";
import NavBar from "@/components/layout/header/NavBar";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <SearchBarContextProvider>
        <NavBar isAdmin />
      </SearchBarContextProvider>
      <div className="flex-1 flex">{children}</div>
      <Footer adminpage={true} />
    </div>
  );
}
