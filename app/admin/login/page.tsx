import { redirect } from "next/navigation";
import { hasAdminSession } from "../../lib/admin-auth";
import { AdminLoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await hasAdminSession()) {
    redirect("/admin");
  }

  return <AdminLoginForm />;
}
