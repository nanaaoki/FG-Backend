/*
  Warnings:

  - You are about to drop the column `cartId` on the `products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_cartId_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "cartId";

-- CreateTable
CREATE TABLE "_cartsToproducts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_cartsToproducts_AB_unique" ON "_cartsToproducts"("A", "B");

-- CreateIndex
CREATE INDEX "_cartsToproducts_B_index" ON "_cartsToproducts"("B");

-- AddForeignKey
ALTER TABLE "_cartsToproducts" ADD CONSTRAINT "_cartsToproducts_A_fkey" FOREIGN KEY ("A") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_cartsToproducts" ADD CONSTRAINT "_cartsToproducts_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
