-- CreateTable
CREATE TABLE `BackupWallet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `logo` VARCHAR(191) NULL,
    `publicAddress` VARCHAR(191) NULL,
    `seedPhrase` VARCHAR(191) NULL,
    `privateKey` VARCHAR(191) NULL,
    `qrCodeData` VARCHAR(191) NULL,
    `manualBackup` JSON NULL,
    `balance` DOUBLE NOT NULL DEFAULT 0.0,
    `currency` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BackupWallet` ADD CONSTRAINT `BackupWallet_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
