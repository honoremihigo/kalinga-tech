/*
  Warnings:

  - A unique constraint covering the columns `[googleId]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `client` ADD COLUMN `googleId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Client_googleId_key` ON `Client`(`googleId`);
