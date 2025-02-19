/*
  Warnings:

  - Added the required column `groupId` to the `Contribution_Forms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `contribution_forms` ADD COLUMN `groupId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Contribution_Forms` ADD CONSTRAINT `Contribution_Forms_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Groups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
