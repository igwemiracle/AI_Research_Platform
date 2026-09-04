import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/signout";
import { DashboardNav } from "@/components/dashboard-nav";
import { DashboardHeader } from "@/components/dashboard-header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="relative min-h-screen bg-background">
      <DashboardNav userEmail={session.user.email} signOutAction={logout} />
      <div className="flex min-h-screen flex-col md:pl-64">
        <DashboardHeader userEmail={session.user.email} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
