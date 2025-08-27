/*
  Warnings:

  - The primary key for the `product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `brand` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `graphicsCard` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `processor` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ram` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resolution` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storage` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` DROP PRIMARY KEY,
    ADD COLUMN `brand` VARCHAR(191) NOT NULL,
    ADD COLUMN `graphicsCard` VARCHAR(191) NOT NULL,
    ADD COLUMN `model` VARCHAR(191) NOT NULL,
    ADD COLUMN `processor` VARCHAR(191) NOT NULL,
    ADD COLUMN `ram` VARCHAR(191) NOT NULL,
    ADD COLUMN `resolution` VARCHAR(191) NOT NULL,
    ADD COLUMN `storage` VARCHAR(191) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);
