-- CreateTable
CREATE TABLE `FoundPost` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `idTag` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `photoUrl` VARCHAR(191) NULL,
    `matchedRegisteredTefillinId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FoundPost` ADD CONSTRAINT `FoundPost_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FoundPost` ADD CONSTRAINT `FoundPost_matchedRegisteredTefillinId_fkey` FOREIGN KEY (`matchedRegisteredTefillinId`) REFERENCES `RegisteredTefillin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
