-- CreateTable
CREATE TABLE `Reservation` (
    `id` VARCHAR(191) NOT NULL,
    `ReservationNumber` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `pickup` VARCHAR(191) NOT NULL,
    `dropoff` VARCHAR(191) NOT NULL,
    `distance` DOUBLE NOT NULL,
    `duration` VARCHAR(191) NOT NULL,
    `paymentSessionId` VARCHAR(191) NULL,
    `paymentIntentId` VARCHAR(191) NULL,
    `paymentStatus` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `numberOfPassengers` INTEGER NOT NULL DEFAULT 1,
    `scheduledDateTime` DATETIME(3) NULL,
    `price` DOUBLE NOT NULL,
    `paymentUrl` TEXT NOT NULL,
    `paymentTransactionNumber` VARCHAR(191) NULL,
    `paymentConfirmedAt` DATETIME(3) NULL,
    `paymentMethod` VARCHAR(191) NULL,
    `riderType` VARCHAR(191) NULL,
    `otherRiderFirstName` VARCHAR(191) NULL,
    `otherRiderLastName` VARCHAR(191) NULL,
    `otherRiderEmail` VARCHAR(191) NULL,
    `otherRiderPhone` VARCHAR(191) NULL,
    `carCategoryId` INTEGER NULL,
    `driverId` INTEGER NULL,
    `driverEarningAmount` DOUBLE NULL,
    `abyrideEarningAmount` DOUBLE NULL,
    `Rating` VARCHAR(191) NOT NULL DEFAULT '0',
    `reservationStatus` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `cancellationReason` VARCHAR(191) NULL,
    `canceledAt` DATETIME(3) NULL,
    `rideCompletedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Reservation_ReservationNumber_key`(`ReservationNumber`),
    UNIQUE INDEX `Reservation_paymentSessionId_key`(`paymentSessionId`),
    UNIQUE INDEX `Reservation_paymentTransactionNumber_key`(`paymentTransactionNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Client_email` VARCHAR(191) NULL,
    `Client_phoneNumber` VARCHAR(191) NULL,

    UNIQUE INDEX `Client_Client_email_key`(`Client_email`),
    UNIQUE INDEX `Client_Client_phoneNumber_key`(`Client_phoneNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` VARCHAR(191) NOT NULL,
    `names` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `isLocked` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Admin_names_key`(`names`),
    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Driver` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NOT NULL DEFAULT 0.0,
    `longitude` DOUBLE NOT NULL DEFAULT 0.0,
    `locationUpdatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dateOfBirth` DATE NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `nationality` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `emergencyContactName` VARCHAR(191) NOT NULL,
    `emergencyContactNumber` VARCHAR(191) NOT NULL,
    `bankAccountNumber` VARCHAR(191) NOT NULL,
    `licenseId` VARCHAR(191) NOT NULL,
    `licenseExpiryDate` DATE NOT NULL,
    `yearsOfExperience` INTEGER NOT NULL,
    `languages` VARCHAR(191) NOT NULL,
    `previousEmployment` VARCHAR(191) NULL,
    `availabilityToStart` DATE NOT NULL,
    `licenseIssuedIn` VARCHAR(191) NULL,
    `nationalIdOrPassport` VARCHAR(191) NULL,
    `policeClearanceCertificate` VARCHAR(191) NULL,
    `proofOfAddress` VARCHAR(191) NULL,
    `drivingCertificate` VARCHAR(191) NULL,
    `workPermitOrVisa` VARCHAR(191) NULL,
    `drugTestReport` VARCHAR(191) NULL,
    `employmentReferenceLetter` VARCHAR(191) NULL,
    `Availability` VARCHAR(191) NULL DEFAULT 'Offline',
    `bankStatementFile` VARCHAR(191) NULL,
    `Status` VARCHAR(191) NOT NULL DEFAULT 'Pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `driverRatingCount` INTEGER NOT NULL DEFAULT 0,
    `googleId` VARCHAR(191) NOT NULL DEFAULT 'dskjdskjdsk',

    UNIQUE INDEX `Driver_phoneNumber_key`(`phoneNumber`),
    UNIQUE INDEX `Driver_email_key`(`email`),
    UNIQUE INDEX `Driver_licenseId_key`(`licenseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vehicle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vinNumber` VARCHAR(191) NOT NULL,
    `make` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `year` VARCHAR(191) NOT NULL,
    `plateNumber` VARCHAR(191) NULL,
    `color` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NULL DEFAULT 'Abyride X',
    `ownerId` INTEGER NOT NULL,
    `registrationState` VARCHAR(191) NULL,
    `registrationDate` DATETIME(3) NULL,
    `expiryDate` DATETIME(3) NULL,
    `insuranceNumber` VARCHAR(191) NULL,
    `insuranceCompany` VARCHAR(191) NULL,
    `insuranceExpiry` DATETIME(3) NULL,
    `numberOfDoors` VARCHAR(191) NULL,
    `seatingCapacity` VARCHAR(191) NULL,
    `exteriorPhoto1` VARCHAR(191) NULL,
    `exteriorPhoto2` VARCHAR(191) NULL,
    `exteriorPhoto3` VARCHAR(191) NULL,
    `exteriorPhoto4` VARCHAR(191) NULL,
    `interiorPhoto1` VARCHAR(191) NULL,
    `interiorPhoto2` VARCHAR(191) NULL,
    `interiorPhoto3` VARCHAR(191) NULL,
    `interiorPhoto4` VARCHAR(191) NULL,
    `serviceHistory` JSON NULL,
    `accidentHistory` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Vehicle_vinNumber_key`(`vinNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FeeCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `bookingFee` DOUBLE NOT NULL,
    `feePerMile` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `FeeCategory_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactMessage` (
    `id` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LostPropertyReport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `bookingReference` VARCHAR(191) NULL,
    `itemCategory` VARCHAR(191) NOT NULL,
    `itemDescription` VARCHAR(191) NOT NULL,
    `approximateValue` VARCHAR(191) NULL,
    `lostLocation` VARCHAR(191) NULL,
    `preferredContact` VARCHAR(191) NOT NULL,
    `bestContactTime` VARCHAR(191) NULL,
    `additionalNotes` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Not found ',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `found_properties` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reservationId` VARCHAR(191) NULL,
    `itemCategory` VARCHAR(191) NOT NULL,
    `itemDescription` VARCHAR(191) NOT NULL,
    `foundLocation` VARCHAR(191) NULL,
    `additionalNotes` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Found',
    `foundAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_carCategoryId_fkey` FOREIGN KEY (`carCategoryId`) REFERENCES `FeeCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `Driver`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
