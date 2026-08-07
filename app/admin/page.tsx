import { redirect } from "next/navigation";
import { AdminDashboard } from "./admin-dashboard";
import { hasAdminSession } from "../lib/admin-auth";
import { getSiteContent } from "../lib/cms-content";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await hasAdminSession())) {
    redirect("/admin/login");
  }

  const content = await getSiteContent();

  return <AdminDashboard initialContent={content} />;
}
