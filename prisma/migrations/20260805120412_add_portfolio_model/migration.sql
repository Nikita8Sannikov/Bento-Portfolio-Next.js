-- Create Portfolio table
CREATE TABLE "Portfolio" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- Slug must be unique
CREATE UNIQUE INDEX "Portfolio_slug_key"
ON "Portfolio"("slug");

-- Create the first portfolio for existing tiles
INSERT INTO "Portfolio" (
    "id",
    "slug",
    "title",
    "description",
    "isPublished",
    "createdAt",
    "updatedAt"
)
VALUES (
    'portfolio_nikita',
    'nikita',
    'Nikita',
    NULL,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- First add nullable portfolioId
ALTER TABLE "Tile"
ADD COLUMN "portfolioId" TEXT;

-- Assign all existing tiles to Nikita's portfolio
UPDATE "Tile"
SET "portfolioId" = 'portfolio_nikita';

-- Now it can safely become required
ALTER TABLE "Tile"
ALTER COLUMN "portfolioId" SET NOT NULL;

-- Position is no longer globally indexed
DROP INDEX IF EXISTS "Tile_position_idx";

-- Position must be unique inside one portfolio
CREATE UNIQUE INDEX "Tile_portfolioId_position_key"
ON "Tile"("portfolioId", "position");

-- Create relation
ALTER TABLE "Tile"
ADD CONSTRAINT "Tile_portfolioId_fkey"
FOREIGN KEY ("portfolioId")
REFERENCES "Portfolio"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;