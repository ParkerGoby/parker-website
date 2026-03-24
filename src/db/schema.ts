import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["viewer", "admin"]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: userRoleEnum("role").notNull().default("viewer"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ],
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })],
);

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

export const muscleGroupEnum = pgEnum("muscle_group", [
  "chest",
  "back",
  "shoulders",
  "biceps",
  "triceps",
  "forearms",
  "quads",
  "hamstrings",
  "glutes",
  "calves",
  "abductors",
  "adductors",
  "core",
  "full_body",
]);

export const exercises = pgTable(
  "exercises",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    muscleGroup: muscleGroupEnum("muscle_group").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [unique().on(table.name, table.userId)],
);

export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sets = pgTable("sets", {
  id: serial("id").primaryKey(),
  workoutId: integer("workout_id")
    .notNull()
    .references(() => workouts.id, { onDelete: "cascade" }),
  exerciseId: integer("exercise_id")
    .notNull()
    .references(() => exercises.id, { onDelete: "cascade" }),
  setOrder: integer("set_order").notNull(),
  weight: integer("weight").notNull(),
  reps: integer("reps").notNull(),
  isDropSet: boolean("is_drop_set").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bodyweight = pgTable(
  "bodyweight",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    weight: integer("weight").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [unique().on(table.userId, table.date)],
);

export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;
export type Workout = typeof workouts.$inferSelect;
export type NewWorkout = typeof workouts.$inferInsert;
export type Set = typeof sets.$inferSelect;
export type NewSet = typeof sets.$inferInsert;
export type Bodyweight = typeof bodyweight.$inferSelect;
export type NewBodyweight = typeof bodyweight.$inferInsert;
