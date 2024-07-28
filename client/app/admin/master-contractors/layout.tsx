export const metadata = {
    title: "Master Contractors",
    description: "Master Contractors page for the Admin",
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
  