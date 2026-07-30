-- CreateEnum
CREATE TYPE "TileType" AS ENUM ('text', 'image', 'link', 'map');

-- CreateEnum
CREATE TYPE "TileSize" AS ENUM ('square', 'wide', 'tall');

-- CreateTable
CREATE TABLE "Tile" (
    "id" TEXT NOT NULL,
    "type" "TileType" NOT NULL,
    "size" "TileSize" NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Tile_position_idx" ON "Tile"("position");
