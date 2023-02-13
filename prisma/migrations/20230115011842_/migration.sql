-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `comment_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `post_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `userinfo` DROP FOREIGN KEY `userinfo_authId_fkey`;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `auth`(`auth_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `auth`(`auth_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userinfo` ADD CONSTRAINT `userinfo_authId_fkey` FOREIGN KEY (`authId`) REFERENCES `auth`(`auth_id`) ON DELETE CASCADE ON UPDATE CASCADE;
