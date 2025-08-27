/*
  Warnings:

  - Made the column `clientId` on table `ride` required. This step will fail if there are existing NULL values in that column.
  - Made the column `driverId` on table `ride` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `ride` DROP FOREIGN KEY `Ride_clientId_fkey`;

-- DropForeignKey
ALTER TABLE `ride` DROP FOREIGN KEY `Ride_driverId_fkey`;

-- DropIndex
DROP INDEX `Ride_clientId_fkey` ON `ride`;

-- DropIndex
DROP INDEX `Ride_driverId_fkey` ON `ride`;

-- AlterTable
ALTER TABLE `ride` MODIFY `clientId` INTEGER NOT NULL,
    MODIFY `driverId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Ride` ADD CONSTRAINT `Ride_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ride` ADD CONSTRAINT `Ride_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `Driver`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
