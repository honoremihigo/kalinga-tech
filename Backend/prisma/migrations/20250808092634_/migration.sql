/*
  Warnings:

  - A unique constraint covering the columns `[paymentSessionId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Made the column `clientId` on table `booking` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_clientId_fkey`;

-- DropIndex
DROP INDEX `Booking_clientId_fkey` ON `booking`;

-- AlterTable
ALTER TABLE `booking` ADD COLUMN `abyrideEarningAmount` DECIMAL(10, 2) NULL,
    ADD COLUMN `bookingStatus` ENUM('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NULL DEFAULT 'PENDING',
    ADD COLUMN `canceledAt` DATETIME(3) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `date` DATETIME(3) NULL,
    ADD COLUMN `distance` DOUBLE NULL,
    ADD COLUMN `driverEarningAmount` DECIMAL(10, 2) NULL,
    ADD COLUMN `driverPackageCharge` DECIMAL(10, 2) NULL,
    ADD COLUMN `driverWaitingCharge` DECIMAL(10, 2) NULL,
    ADD COLUMN `dropoffAddress` TEXT NULL,
    ADD COLUMN `dropoffNote` VARCHAR(191) NULL,
    ADD COLUMN `duration` VARCHAR(191) NULL,
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `extraCharge` DECIMAL(10, 2) NULL,
    ADD COLUMN `firstName` VARCHAR(191) NULL,
    ADD COLUMN `lastName` VARCHAR(191) NULL,
    ADD COLUMN `luggageCount` INTEGER NULL DEFAULT 0,
    ADD COLUMN `paymentConfirmedAt` DATETIME(3) NULL,
    ADD COLUMN `paymentIntentId` VARCHAR(191) NULL,
    ADD COLUMN `paymentMethod` ENUM('CASH', 'CREDITCARD') NULL,
    ADD COLUMN `paymentSessionId` VARCHAR(191) NULL,
    ADD COLUMN `paymentStatus` ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `phoneNumber` VARCHAR(191) NULL,
    ADD COLUMN `pickupAddress` TEXT NULL,
    ADD COLUMN `pickupNote` VARCHAR(191) NULL,
    ADD COLUMN `price` DECIMAL(10, 2) NULL,
    ADD COLUMN `rating` VARCHAR(191) NULL DEFAULT '0',
    ADD COLUMN `rideCompletedAt` DATETIME(3) NULL,
    MODIFY `clientId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `BookingReturn` (
    `id` VARCHAR(191) NOT NULL,
    `bookingId` VARCHAR(191) NOT NULL,
    `returnDate` DATETIME(3) NOT NULL,
    `pickupAddress` TEXT NOT NULL,
    `dropoffAddress` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Booking_paymentSessionId_key` ON `Booking`(`paymentSessionId`);

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookingReturn` ADD CONSTRAINT `BookingReturn_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
