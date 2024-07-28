export const metadata = {
    title: "ANG | Project Requests",
    description: "Projects request page for the Admin/PM.",
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
  