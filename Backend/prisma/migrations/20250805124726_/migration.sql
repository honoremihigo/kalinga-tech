/*
  Warnings:

  - You are about to alter the column `ridePurposes` on the `member` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `member` MODIFY `ridePurposes` JSON NULL;
