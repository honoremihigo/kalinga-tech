-- AlterTable
ALTER TABLE `bookingreturn` ADD COLUMN `distance` DOUBLE NULL,
    ADD COLUMN `dropoffNote` VARCHAR(191) NULL,
    ADD COLUMN `duration` VARCHAR(191) NULL,
    ADD COLUMN `pickupNote` VARCHAR(191) NULL;
