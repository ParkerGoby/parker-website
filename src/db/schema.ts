import {
  boolean,
  date,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  date: date("date").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  tags: text("tags").array(),
  published: boolean("published").default(false),
  readingTime: varchar("reading_time", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
