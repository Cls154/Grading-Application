-- CreateTable
CREATE TABLE `My_Contribution` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userGroupId` INTEGER NOT NULL,
    `myUserReflection` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Contribution_Forms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contributionsId` INTEGER NOT NULL,
    `targetUserId` INTEGER NOT NULL,
    `targetUserContribution` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `My_Contribution` ADD CONSTRAINT `My_Contribution_userGroupId_fkey` FOREIGN KEY (`userGroupId`) REFERENCES `User_Group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contribution_Forms` ADD CONSTRAINT `Contribution_Forms_contributionsId_fkey` FOREIGN KEY (`contributionsId`) REFERENCES `My_Contribution`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contribution_Forms` ADD CONSTRAINT `Contribution_Forms_targetUserId_fkey` FOREIGN KEY (`targetUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
