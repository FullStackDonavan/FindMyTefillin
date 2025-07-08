/*
  Warnings:

  - You are about to alter the column `status` on the `FoundPost` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `FoundPost` MODIFY `status` ENUM('unclaimed', 'lost', 'found', 'foundButLost') NOT NULL DEFAULT 'unclaimed';
