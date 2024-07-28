export const metadata = {
  title: "Cost Management",
  description: "Cost Management page for the Admin.",
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
