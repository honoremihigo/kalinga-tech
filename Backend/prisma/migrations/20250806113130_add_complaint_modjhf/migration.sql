-- DropForeignKey
ALTER TABLE `complaint` DROP FOREIGN KEY `Complaint_rideId_fkey`;

-- DropIndex
DROP INDEX `Complaint_rideId_fkey` ON `complaint`;
