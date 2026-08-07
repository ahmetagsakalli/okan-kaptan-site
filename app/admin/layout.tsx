import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin Panel | Okan Kaptan",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
