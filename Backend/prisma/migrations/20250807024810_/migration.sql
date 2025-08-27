-- CreateTable
CREATE TABLE `Booking` (
    `id` VARCHAR(191) NOT NULL,
    `bookingNumber` VARCHAR(191) NOT NULL,
    `clientId` INTEGER NULL,
    `driverId` INTEGER NULL,

    UNIQUE INDEX `Booking_bookingNumber_key`(`bookingNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LostProperties` (
    `id` VARCHAR(191) NOT NULL,
    `bokingNumber` VARCHAR(191) NULL,
    `itemName` VARCHAR(191) NOT NULL,
    `itemDescription` VARCHAR(191) NOT NULL,
    `returnerName` VARCHAR(191) NULL,
    `returnerPhone` VARCHAR(191) NULL,
    `returnerEmail` VARCHAR(191) NULL,
    `status` ENUM('lost', 'found') NOT NULL DEFAULT 'lost',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `Driver`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LostProperties` ADD CONSTRAINT `LostProperties_bokingNumber_fkey` FOREIGN KEY (`bokingNumber`) REFERENCES `Booking`(`bookingNumber`) ON DELETE CASCADE ON UPDATE CASCADE;
