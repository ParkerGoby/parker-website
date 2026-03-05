CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(500) NOT NULL,
	"date" date NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"tags" text[],
	"published" boolean DEFAULT false,
	"reading_time" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
