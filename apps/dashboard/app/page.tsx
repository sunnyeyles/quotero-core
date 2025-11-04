import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function Page() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Quotero Dashboard</h1>
        <p className="text-muted-foreground">Multi-tenant chatbot platform</p>
            <a
          href="/sign-in"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Sign In
          </a>
        </div>
    </div>
  );
}
