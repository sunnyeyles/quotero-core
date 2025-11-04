import { requireAuth } from "@/lib/auth/server";
import { getClientByClerkUserId } from "@/lib/db";
import { db, chatbots } from "@workspace/database";
import { eq } from "drizzle-orm";

export default async function ChatbotsPage() {
  const clerkUserId = await requireAuth();
  const client = await getClientByClerkUserId(clerkUserId);

  if (!client) {
    return <div>Client not found</div>;
  }

  const clientChatbots = await db
    .select()
    .from(chatbots)
    .where(eq(chatbots.clientId, client.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Chatbots</h1>
        <p className="text-muted-foreground mt-2">
          View your chatbot configurations
        </p>
      </div>

      <div className="grid gap-4">
        {clientChatbots.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No chatbots configured yet
          </div>
        ) : (
          clientChatbots.map((chatbot) => (
            <div
              key={chatbot.id}
              className="border border-border rounded-lg p-6 bg-card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{chatbot.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Slug: {chatbot.slug}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      chatbot.isActive
                        ? "bg-green-500/10 text-green-500"
                        : "bg-gray-500/10 text-gray-500"
                    }`}
                  >
                    {chatbot.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Model:</span>{" "}
                  {chatbot.model}
                </div>
                <div>
                  <span className="text-muted-foreground">Temperature:</span>{" "}
                  {chatbot.temperature}
                </div>
                <div>
                  <span className="text-muted-foreground">Max Tokens:</span>{" "}
                  {chatbot.maxTokens}
                </div>
                <div>
                  <span className="text-muted-foreground">Top K:</span>{" "}
                  {chatbot.topK}
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Similarity Threshold:
                  </span>{" "}
                  {chatbot.similarityThreshold}%
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
