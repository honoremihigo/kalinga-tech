-- CreateTable
CREATE TABLE `FoundProperties` (
    `id` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `itemDescription` VARCHAR(191) NOT NULL,
    `locationFound` VARCHAR(191) NOT NULL,
    `driverId` INTEGER NULL,
    `ownerId` VARCHAR(191) NULL,
    `returnerName` VARCHAR(191) NULL,
    `returnerEmail` VARCHAR(191) NULL,
    `returnerPhone` VARCHAR(191) NULL,
    `status` ENUM('pending', 'returned', 'unclaimed') NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `FoundProperties_ownerId_key`(`ownerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Claimant` (
    `id` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `description` VARCHAR(191) NOT NULL,
    `foundPropertyId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FoundProperties` ADD CONSTRAINT `FoundProperties_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `Driver`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FoundProperties` ADD CONSTRAINT `FoundProperties_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `Claimant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Claimant` ADD CONSTRAINT `Claimant_foundPropertyId_fkey` FOREIGN KEY (`foundPropertyId`) REFERENCES `FoundProperties`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
