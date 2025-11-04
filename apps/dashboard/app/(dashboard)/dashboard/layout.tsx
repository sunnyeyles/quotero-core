import { redirect } from "next/navigation";
import { requireAuth, getCurrentUser } from "@/lib/auth/server";
import { getClientByClerkUserId, createClientForClerkUser, generateSlug } from "@/lib/db";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerkUserId = await requireAuth();
  
  // Ensure client exists
  let client = await getClientByClerkUserId(clerkUserId);
  
  if (!client) {
    // Create client on first login
    try {
      const user = await getCurrentUser();
      if (!user) {
        redirect("/");
      }

      const name = user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.emailAddresses[0]?.emailAddress || "Client";
      
      const slug = generateSlug(name);

      client = await createClientForClerkUser(
        clerkUserId,
        name,
        slug
      );
    } catch (error) {
      console.error("Error creating client:", error);
      redirect("/");
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

