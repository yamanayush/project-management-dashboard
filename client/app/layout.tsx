import "./globals.css";
import { Inter } from "next/font/google";
import Chakra from "./components/Chakra";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ANG PM App",
  description:
    "Project Management App created using Chakra UI, Typescript and NextJS for ANG consultants.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <main className="border-radius: 2px">{children}</main>
      </body>
    </html>
  );
}
