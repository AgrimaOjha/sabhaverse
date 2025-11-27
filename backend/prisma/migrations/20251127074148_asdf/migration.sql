-- AlterTable
ALTER TABLE `Comment` MODIFY `content` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Debate` MODIFY `description` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `DebateReply` MODIFY `content` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Post` MODIFY `content` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `bio` VARCHAR(191) NULL;
