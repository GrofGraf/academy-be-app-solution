-- CreateTable
CREATE TABLE "gold_price" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "published_at_on_source" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gold_price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gold_price_note" (
    "id" TEXT NOT NULL,
    "gold_price_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gold_price_note_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "gold_price_created_at_idx" ON "gold_price" USING HASH ("created_at");

-- CreateIndex
CREATE INDEX "gold_price_published_at_on_source_idx" ON "gold_price" USING HASH ("published_at_on_source");

-- AddForeignKey
ALTER TABLE "gold_price_note" ADD CONSTRAINT "gold_price_note_gold_price_id_fkey" FOREIGN KEY ("gold_price_id") REFERENCES "gold_price"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gold_price_note" ADD CONSTRAINT "gold_price_note_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
