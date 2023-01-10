/*
  Warnings:

  - You are about to alter the column `isTop` on the `post` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `UnsignedInt`.

*/
-- AlterTable
ALTER TABLE `post` MODIFY `isTop` INTEGER UNSIGNED NOT NULL DEFAULT 0;
