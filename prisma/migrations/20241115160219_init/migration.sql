/*
  Warnings:

  - You are about to drop the column `userId` on the `BackupWallet` table. All the data in the column will be lost.
  - Added the required column `email` to the `BackupWallet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `BackupWallet` DROP FOREIGN KEY `BackupWallet_userId_fkey`;

-- AlterTable
ALTER TABLE `BackupWallet` DROP COLUMN `userId`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `BackupWallet` ADD CONSTRAINT `BackupWallet_email_fkey` FOREIGN KEY (`email`) REFERENCES `User`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
