import "../globals.css";
import { Inter } from "next/font/google";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Providers from "../components/Providers";
import Chakra from "../components/Chakra";
import Head from "next/head";

export const metadata = {
  title: "ANG | Home",
  description:
    "Project Management App created using Chakra UI, Typescript and NextJS for ANG consultants.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <Providers>
        <Chakra>
          <Navbar />
          <div className="flex">
            {/* @ts-ignore */}
            <Sidebar />
            <Head>
              <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
                rel="stylesheet"
              />
            </Head>
            <div className="border-radius: 2px">{children}</div>
          </div>
        </Chakra>
      </Providers>
  );
}
