-- AlterTable
ALTER TABLE `driver` ADD COLUMN `feeCategoryId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Driver` ADD CONSTRAINT `Driver_feeCategoryId_fkey` FOREIGN KEY (`feeCategoryId`) REFERENCES `FeeCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
