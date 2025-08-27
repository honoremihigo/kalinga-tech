/*
  Warnings:

  - A unique constraint covering the columns `[googleId]` on the table `Driver` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Driver_googleId_key` ON `Driver`(`googleId`);
