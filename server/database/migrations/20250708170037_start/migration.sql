-- AlterTable
ALTER TABLE `LostTefillinReport` ADD COLUMN `registeredTefillinId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `LostTefillinReport` ADD CONSTRAINT `LostTefillinReport_registeredTefillinId_fkey` FOREIGN KEY (`registeredTefillinId`) REFERENCES `RegisteredTefillin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
