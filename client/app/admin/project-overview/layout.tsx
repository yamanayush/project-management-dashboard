export const metadata = {
  title: "Project Overview",
  description: "Project Overview page for the Admin/PM.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="border-radius: 2px">{children}</div>
    </>
  );
}
