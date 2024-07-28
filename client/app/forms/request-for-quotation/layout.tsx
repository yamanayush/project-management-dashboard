export const metadata = {
  title: "Forms | RFQ",
  description: "Request for Quotation form for the Admin.",
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
