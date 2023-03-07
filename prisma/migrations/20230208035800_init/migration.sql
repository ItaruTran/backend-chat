
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
SET enable_partition_pruning = on;

-- CreateTable
CREATE TABLE "attachments" (
    "id" UUID NOT NULL,
    "message_id" UUID NOT NULL,
    "group_id" INTEGER NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "created" TIMESTAMPTZ(6) NOT NULL DEFAULT current_timestamp,
    "order" INTEGER,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_chats" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "owner_id" UUID,
    "friend_id" UUID,
    "group_avatar" VARCHAR(255),
    "last_message_time" TIMESTAMPTZ(6),
    "created" TIMESTAMPTZ(6) NOT NULL DEFAULT current_timestamp,
    "modified" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "group_chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "member_id" UUID NOT NULL,
    "group_id" INTEGER NOT NULL,
    "viewed_message_time" TIMESTAMPTZ(6),
    "viewed_message_id" UUID,
    "view_message_from" TIMESTAMPTZ(6),
    "created" TIMESTAMPTZ(6) NOT NULL DEFAULT current_timestamp,
    "modified" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("member_id","group_id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS message (
  id  UUID not null,
  timestamp  timestamp with time zone DEFAULT current_timestamp,
  content  text,
  sender_id  UUID not null,
  group_id  integer,
  CONSTRAINT message_pkey PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE (timestamp);

CREATE INDEX if not EXISTS idx_message_group_id_timestamp
ON message (group_id, timestamp DESC);

CREATE INDEX "message_id_idx" ON "message" USING HASH ("id");

-- CREATE UNLOGGED TABLE IF NOT EXISTS message_2023 PARTITION OF message
--   FOR VALUES FROM ('2023-01-01 00:00:00') TO ('2024-01-01 00:00:00');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255),
    "created" TIMESTAMPTZ(6) NOT NULL DEFAULT current_timestamp,
    "modified" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "attachments_group_id_created" ON "attachments"("group_id", "created");

-- CreateIndex
CREATE INDEX "attachments_message_id" ON "attachments"("message_id");

-- CreateIndex
CREATE INDEX "group_chats_owner_id" ON "group_chats"("owner_id");

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group_chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group_chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
