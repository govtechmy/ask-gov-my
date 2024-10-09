import Footer from "@/components/layout/footer";
import BaseHeader from "@/components/layout/header/BaseHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <BaseHeader isAdmin></BaseHeader>
      <div className="flex-1 flex">{children}</div>
      <Footer adminpage={true} />
    </div>
  );
}
