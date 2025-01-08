export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:px-24 prose dark:prose-invert prose-img:shadow prose-img:rounded-md prose-img:border bg-white shadow">
      {children}
    </div>
  );
}
