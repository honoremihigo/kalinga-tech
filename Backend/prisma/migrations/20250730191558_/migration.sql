/*
  Warnings:

  - You are about to alter the column `startRate` on the `fare` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `startRatePerMile` on the `fare` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.

*/
-- AlterTable
ALTER TABLE `fare` MODIFY `startRate` DOUBLE NOT NULL,
    MODIFY `startRatePerMile` DOUBLE NOT NULL;
