import BaseHeader from '@/components/common/Header/BaseHeader';
import SearchNavbar from '@/components/common/SearchNavbar/SearchNavbar';
import ContextSearchBar from '@/components/context/ContextSearchBar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ContextSearchBar>
        <BaseHeader></BaseHeader>
        <SearchNavbar></SearchNavbar>
      </ContextSearchBar>
      {children}
    </>
  );
}
