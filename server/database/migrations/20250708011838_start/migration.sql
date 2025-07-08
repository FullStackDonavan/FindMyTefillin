-- CreateTable
CREATE TABLE `LostTefillinReport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idTag` VARCHAR(191) NOT NULL,
    `registered` BOOLEAN NOT NULL,
    `qrAttached` BOOLEAN NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `alternatePhone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `photoUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
