import { pgTable, text, timestamp, uuid, integer, boolean, jsonb, vector } from "drizzle-orm/pg-core";

export const clients = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  apiKey: text("api_key").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  // Usage limits
  monthlyUsageLimit: integer("monthly_usage_limit"),
  currentMonthlyUsage: integer("current_monthly_usage").default(0).notNull(),
  // Settings
  isActive: boolean("is_active").default(true).notNull(),
  metadata: jsonb("metadata"),
});

export const chatbots = pgTable("chatbots", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id").references(() => clients.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  // Model configuration
  model: text("model").notNull().default("gpt-4"),
  temperature: integer("temperature").default(0.7),
  maxTokens: integer("max_tokens").default(1000),
  // RAG settings
  topK: integer("top_k").default(5), // Number of chunks to retrieve
  similarityThreshold: integer("similarity_threshold").default(70), // 0-100
  // System prompt
  systemPrompt: text("system_prompt"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id").references(() => clients.id, { onDelete: "cascade" }).notNull(),
  chatbotId: uuid("chatbot_id").references(() => chatbots.id, { onDelete: "cascade" }),
  filename: text("filename").notNull(),
  originalFilename: text("original_filename").notNull(),
  fileType: text("file_type").notNull(), // pdf, docx, txt
  fileSize: integer("file_size").notNull(), // bytes
  storageUrl: text("storage_url").notNull(), // Vercel Blob URL or S3 URL
  // Processing status
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  processedAt: timestamp("processed_at"),
  errorMessage: text("error_message"),
  // Metadata
  metadata: jsonb("metadata"), // Extracted metadata (page count, word count, etc.)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const documentChunks = pgTable("document_chunks", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentId: uuid("document_id").references(() => documents.id, { onDelete: "cascade" }).notNull(),
  chunkIndex: integer("chunk_index").notNull(),
  content: text("content").notNull(),
  // Metadata for chunk
  startChar: integer("start_char"),
  endChar: integer("end_char"),
  metadata: jsonb("metadata"), // Page number, section, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const documentEmbeddings = pgTable("document_embeddings", {
  id: uuid("id").primaryKey().defaultRandom(),
  chunkId: uuid("chunk_id").references(() => documentChunks.id, { onDelete: "cascade" }).notNull(),
  embedding: vector("embedding", { dimensions: 1536 }), // OpenAI dimensions
  model: text("model").notNull().default("text-embedding-3-small"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const apiUsageLogs = pgTable("api_usage_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id").references(() => clients.id, { onDelete: "cascade" }).notNull(),
  chatbotId: uuid("chatbot_id").references(() => chatbots.id, { onDelete: "set null" }),
  // Request details
  endpoint: text("endpoint").notNull(),
  method: text("method").notNull(),
  model: text("model").notNull(),
  // Token usage
  promptTokens: integer("prompt_tokens").default(0),
  completionTokens: integer("completion_tokens").default(0),
  totalTokens: integer("total_tokens").default(0),
  // Cost calculation
  cost: integer("cost"), // Cost in cents
  // Request metadata
  userId: text("user_id"), // Optional: track individual users
  sessionId: text("session_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const trainingJobs = pgTable("training_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id").references(() => clients.id, { onDelete: "cascade" }).notNull(),
  chatbotId: uuid("chatbot_id").references(() => chatbots.id, { onDelete: "cascade" }).notNull(),
  documentId: uuid("document_id").references(() => documents.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  progress: integer("progress").default(0), // 0-100
  // Job details
  jobType: text("job_type").notNull(), // embedding, fine_tune, reindex
  errorMessage: text("error_message"),
  metadata: jsonb("metadata"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

