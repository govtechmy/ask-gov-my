import { SearchBarContextProvider } from "@/components/context/SearchBarContext";

export default function PublicTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SearchBarContextProvider>{children}</SearchBarContextProvider>;
}
