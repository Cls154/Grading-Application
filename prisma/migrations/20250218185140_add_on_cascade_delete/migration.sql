-- DropForeignKey
ALTER TABLE `contribution_forms` DROP FOREIGN KEY `Contribution_Forms_contributionsId_fkey`;

-- DropForeignKey
ALTER TABLE `contribution_forms` DROP FOREIGN KEY `Contribution_Forms_targetUserId_fkey`;

-- DropForeignKey
ALTER TABLE `groups` DROP FOREIGN KEY `Groups_moduleId_fkey`;

-- DropForeignKey
ALTER TABLE `my_contribution` DROP FOREIGN KEY `My_Contribution_userGroupId_fkey`;

-- DropForeignKey
ALTER TABLE `user_group` DROP FOREIGN KEY `User_Group_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `user_group` DROP FOREIGN KEY `User_Group_userId_fkey`;

-- DropForeignKey
ALTER TABLE `user_module` DROP FOREIGN KEY `User_Module_moduleId_fkey`;

-- DropForeignKey
ALTER TABLE `user_module` DROP FOREIGN KEY `User_Module_userId_fkey`;

-- DropIndex
DROP INDEX `Contribution_Forms_contributionsId_fkey` ON `contribution_forms`;

-- DropIndex
DROP INDEX `Contribution_Forms_targetUserId_fkey` ON `contribution_forms`;

-- DropIndex
DROP INDEX `Groups_moduleId_fkey` ON `groups`;

-- DropIndex
DROP INDEX `My_Contribution_userGroupId_fkey` ON `my_contribution`;

-- DropIndex
DROP INDEX `User_Group_groupId_fkey` ON `user_group`;

-- DropIndex
DROP INDEX `User_Group_userId_fkey` ON `user_group`;

-- DropIndex
DROP INDEX `User_Module_moduleId_fkey` ON `user_module`;

-- AddForeignKey
ALTER TABLE `User_Module` ADD CONSTRAINT `User_Module_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Module` ADD CONSTRAINT `User_Module_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `Module`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Groups` ADD CONSTRAINT `Groups_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `Module`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Group` ADD CONSTRAINT `User_Group_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_Group` ADD CONSTRAINT `User_Group_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Groups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `My_Contribution` ADD CONSTRAINT `My_Contribution_userGroupId_fkey` FOREIGN KEY (`userGroupId`) REFERENCES `User_Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contribution_Forms` ADD CONSTRAINT `Contribution_Forms_contributionsId_fkey` FOREIGN KEY (`contributionsId`) REFERENCES `My_Contribution`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contribution_Forms` ADD CONSTRAINT `Contribution_Forms_targetUserId_fkey` FOREIGN KEY (`targetUserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
