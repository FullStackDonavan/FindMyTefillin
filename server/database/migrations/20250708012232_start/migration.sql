/*
  Warnings:

  - Added the required column `userId` to the `LostTefillinReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `LostTefillinReport` ADD COLUMN `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `LostTefillinReport` ADD CONSTRAINT `LostTefillinReport_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
