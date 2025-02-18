/*
  Warnings:

  - Added the required column `hasSubmitted` to the `User_Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user_group` ADD COLUMN `hasSubmitted` BOOLEAN NOT NULL;
