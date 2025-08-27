/*
  Warnings:

  - Added the required column `referredContact` to the `found_properties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `found_properties` ADD COLUMN `approximateValue` VARCHAR(191) NULL,
    ADD COLUMN `bestContactTime` VARCHAR(191) NULL,
    ADD COLUMN `referredContact` VARCHAR(191) NOT NULL;
