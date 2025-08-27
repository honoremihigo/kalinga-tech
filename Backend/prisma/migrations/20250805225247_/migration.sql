/*
  Warnings:

  - Added the required column `fullName` to the `found_properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `found_properties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `found_properties` ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `fullName` VARCHAR(191) NOT NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NOT NULL;
