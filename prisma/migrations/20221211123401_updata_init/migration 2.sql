/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `auth` (
    `auth_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `auth_username_key`(`username`),
    UNIQUE INDEX `auth_email_key`(`email`),
    PRIMARY KEY (`auth_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userinfo` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `avatar` VARCHAR(191) NOT NULL,
    `exp` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `level` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `authId` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `userinfo_authId_key`(`authId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `userinfo` ADD CONSTRAINT `userinfo_authId_fkey` FOREIGN KEY (`authId`) REFERENCES `auth`(`auth_id`) ON DELETE CASCADE ON UPDATE CASCADE;
