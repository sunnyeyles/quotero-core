import { requireAuth } from "@/lib/auth/server";
import { getClientByClerkUserId } from "@/lib/db";
import { db, apiUsageLogs } from "@workspace/database";
import { eq, desc, gte } from "drizzle-orm";
import { UsageChart } from "@/components/dashboard/usage-chart";

export default async function UsagePage() {
  const clerkUserId = await requireAuth();
  const client = await getClientByClerkUserId(clerkUserId);

  if (!client) {
    return <div>Client not found</div>;
  }

  // Get usage for the current month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const monthlyUsage = await db
    .select()
    .from(apiUsageLogs)
    .where(eq(apiUsageLogs.clientId, client.id))
    .where(gte(apiUsageLogs.createdAt, startOfMonth))
    .orderBy(desc(apiUsageLogs.createdAt))
    .limit(100);

  const totalTokens = monthlyUsage.reduce(
    (sum, log) => sum + (log.totalTokens || 0),
    0
  );
  const totalCost = monthlyUsage.reduce((sum, log) => sum + (log.cost || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Usage Statistics</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your API usage and costs
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="border border-border rounded-lg p-6 bg-card">
          <div className="text-sm text-muted-foreground">Current Usage</div>
          <div className="text-2xl font-bold mt-2">
            {client.currentMonthlyUsage.toLocaleString()}
          </div>
          {client.monthlyUsageLimit && (
            <div className="text-xs text-muted-foreground mt-1">
              of {client.monthlyUsageLimit.toLocaleString()} limit
            </div>
          )}
        </div>

        <div className="border border-border rounded-lg p-6 bg-card">
          <div className="text-sm text-muted-foreground">Total Tokens (This Month)</div>
          <div className="text-2xl font-bold mt-2">
            {totalTokens.toLocaleString()}
          </div>
        </div>

        <div className="border border-border rounded-lg p-6 bg-card">
          <div className="text-sm text-muted-foreground">Total Cost (This Month)</div>
          <div className="text-2xl font-bold mt-2">
            ${(totalCost / 100).toFixed(2)}
          </div>
        </div>
      </div>

      <UsageChart usageLogs={monthlyUsage} />
    </div>
  );
}

