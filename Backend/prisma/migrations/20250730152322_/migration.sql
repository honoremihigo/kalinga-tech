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

-- AlterTable
ALTER TABLE `vehicle` ADD COLUMN `handluggage` VARCHAR(191) NULL,
    ADD COLUMN `luggage` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Category_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fare` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryId` INTEGER NOT NULL,
    `fromDay` VARCHAR(191) NOT NULL,
    `tillDay` VARCHAR(191) NOT NULL,
    `fromTime` VARCHAR(191) NOT NULL,
    `tillTime` VARCHAR(191) NOT NULL,
    `startRate` VARCHAR(191) NOT NULL,
    `startRatePerMile` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Fare` ADD CONSTRAINT `Fare_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ride` ADD CONSTRAINT `Ride_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ride` ADD CONSTRAINT `Ride_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `Driver`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
