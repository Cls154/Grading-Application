/*
  Warnings:

  - You are about to drop the `_usermodules` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_usermodules` DROP FOREIGN KEY `_UserModules_A_fkey`;

-- DropForeignKey
ALTER TABLE `_usermodules` DROP FOREIGN KEY `_UserModules_B_fkey`;

-- DropTable
DROP TABLE `_usermodules`;

-- CreateTable
CREATE TABLE `User_Module` (
    `userId` INTEGER NOT NULL,
    `moduleId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `moduleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User_Module` ADD CONSTRAINT `User_Module_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Module` ADD CONSTRAINT `User_Module_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `Module`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
