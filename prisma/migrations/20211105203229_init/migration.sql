/*
  Warnings:

  - You are about to drop the column `sessionId` on the `tasks` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `tasks_sessionId_fkey` ON `tasks`;

-- AlterTable
ALTER TABLE `tasks` DROP COLUMN `sessionId`;
