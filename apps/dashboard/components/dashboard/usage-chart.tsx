"use client";

interface UsageLog {
  id: string;
  totalTokens: number | null;
  cost: number | null;
  createdAt: string;
}

interface UsageChartProps {
  usageLogs: UsageLog[];
}

export function UsageChart({ usageLogs }: UsageChartProps) {
  // Group usage by date
  const usageByDate = usageLogs.reduce((acc, log) => {
    const date = new Date(log.createdAt).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { tokens: 0, cost: 0 };
    }
    acc[date].tokens += log.totalTokens || 0;
    acc[date].cost += log.cost || 0;
    return acc;
  }, {} as Record<string, { tokens: number; cost: number }>);

  const dates = Object.keys(usageByDate).sort();

  if (dates.length === 0) {
    return (
      <div className="border border-border rounded-lg p-12 bg-card text-center">
        <p className="text-muted-foreground">No usage data available</p>
      </div>
    );
  }

  const maxTokens = Math.max(...dates.map((date) => usageByDate[date].tokens));

  return (
    <div className="border border-border rounded-lg p-6 bg-card">
      <h2 className="text-lg font-semibold mb-4">Daily Usage</h2>
      <div className="space-y-4">
        {dates.map((date) => {
          const { tokens, cost } = usageByDate[date];
          const percentage = maxTokens > 0 ? (tokens / maxTokens) * 100 : 0;

          return (
            <div key={date} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{date}</span>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span>{tokens.toLocaleString()} tokens</span>
                  <span>${(cost / 100).toFixed(2)}</span>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

