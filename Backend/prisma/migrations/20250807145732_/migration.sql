/*
  Warnings:

  - You are about to drop the column `bokingNumber` on the `lostproperties` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `lostproperties` DROP FOREIGN KEY `LostProperties_bokingNumber_fkey`;

-- DropIndex
DROP INDEX `LostProperties_bokingNumber_fkey` ON `lostproperties`;

-- AlterTable
ALTER TABLE `lostproperties` DROP COLUMN `bokingNumber`,
    ADD COLUMN `bookingNumber` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `LostProperties` ADD CONSTRAINT `LostProperties_bookingNumber_fkey` FOREIGN KEY (`bookingNumber`) REFERENCES `Booking`(`bookingNumber`) ON DELETE CASCADE ON UPDATE CASCADE;
