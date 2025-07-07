/*
  Warnings:

  - You are about to drop the column `postId` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the `Ad` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AdImpression` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Books` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Chapters` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CrossReference` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Devotional` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Friendship` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroupComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroupMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroupPhoto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroupPost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroupReaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroupVideo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HighlightedVerse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LikedGame` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LiveStream` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Place` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Polemics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PrayerJournalEntry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuranAyah` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuranSurah` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuranTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Translation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Verses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Video` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WordTranslation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GameTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `AdImpression` DROP FOREIGN KEY `AdImpression_adId_fkey`;

-- DropForeignKey
ALTER TABLE `AdImpression` DROP FOREIGN KEY `AdImpression_gameId_fkey`;

-- DropForeignKey
ALTER TABLE `AdImpression` DROP FOREIGN KEY `AdImpression_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Books` DROP FOREIGN KEY `Books_translationId_fkey`;

-- DropForeignKey
ALTER TABLE `Chapters` DROP FOREIGN KEY `Chapters_bookId_fkey`;

-- DropForeignKey
ALTER TABLE `CrossReference` DROP FOREIGN KEY `CrossReference_fromVerseId_fkey`;

-- DropForeignKey
ALTER TABLE `CrossReference` DROP FOREIGN KEY `CrossReference_toVerseId_fkey`;

-- DropForeignKey
ALTER TABLE `Friendship` DROP FOREIGN KEY `Friendship_friendId_fkey`;

-- DropForeignKey
ALTER TABLE `Friendship` DROP FOREIGN KEY `Friendship_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Game` DROP FOREIGN KEY `Game_adId_fkey`;

-- DropForeignKey
ALTER TABLE `Game` DROP FOREIGN KEY `Game_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Group` DROP FOREIGN KEY `Group_adminId_fkey`;

-- DropForeignKey
ALTER TABLE `GroupComment` DROP FOREIGN KEY `GroupComment_groupPostId_fkey`;

-- DropForeignKey
ALTER TABLE `GroupComment` DROP FOREIGN KEY `GroupComment_userId_fkey`;

-- DropForeignKey
ALTER TABLE `GroupMember` DROP FOREIGN KEY `GroupMember_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `GroupMember` DROP FOREIGN KEY `GroupMember_userId_fkey`;

-- DropForeignKey
ALTER TABLE `GroupPhoto` DROP FOREIGN KEY `GroupPhoto_groupPostId_fkey`;

-- DropForeignKey
ALTER TABLE `GroupPhoto` DROP FOREIGN KEY `GroupPhoto_userId_fkey`;

-- DropForeignKey
ALTER TABLE `GroupPost` DROP FOREIGN KEY `GroupPost_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `GroupPost` DROP FOREIGN KEY `GroupPost_userId_fkey`;

-- DropForeignKey
ALTER TABLE `GroupReaction` DROP FOREIGN KEY `GroupReaction_groupPostId_fkey`;

-- DropForeignKey
ALTER TABLE `GroupReaction` DROP FOREIGN KEY `GroupReaction_userId_fkey`;

-- DropForeignKey
ALTER TABLE `GroupVideo` DROP FOREIGN KEY `GroupVideo_groupPostId_fkey`;

-- DropForeignKey
ALTER TABLE `GroupVideo` DROP FOREIGN KEY `GroupVideo_userId_fkey`;

-- DropForeignKey
ALTER TABLE `HighlightedVerse` DROP FOREIGN KEY `HighlightedVerse_userId_fkey`;

-- DropForeignKey
ALTER TABLE `HighlightedVerse` DROP FOREIGN KEY `HighlightedVerse_verseId_fkey`;

-- DropForeignKey
ALTER TABLE `LikedGame` DROP FOREIGN KEY `LikedGame_gameId_fkey`;

-- DropForeignKey
ALTER TABLE `LikedGame` DROP FOREIGN KEY `LikedGame_userId_fkey`;

-- DropForeignKey
ALTER TABLE `LiveStream` DROP FOREIGN KEY `LiveStream_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Note` DROP FOREIGN KEY `Note_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Note` DROP FOREIGN KEY `Note_verseId_fkey`;

-- DropForeignKey
ALTER TABLE `Photo` DROP FOREIGN KEY `Photo_postId_fkey`;

-- DropForeignKey
ALTER TABLE `Place` DROP FOREIGN KEY `Place_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Place` DROP FOREIGN KEY `Place_verseId_fkey`;

-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_userId_fkey`;

-- DropForeignKey
ALTER TABLE `PrayerJournalEntry` DROP FOREIGN KEY `PrayerJournalEntry_userId_fkey`;

-- DropForeignKey
ALTER TABLE `QuranAyah` DROP FOREIGN KEY `QuranAyah_surahId_fkey`;

-- DropForeignKey
ALTER TABLE `QuranAyah` DROP FOREIGN KEY `QuranAyah_translationId_fkey`;

-- DropForeignKey
ALTER TABLE `QuranSurah` DROP FOREIGN KEY `QuranSurah_translationId_fkey`;

-- DropForeignKey
ALTER TABLE `Reaction` DROP FOREIGN KEY `Reaction_postId_fkey`;

-- DropForeignKey
ALTER TABLE `Reaction` DROP FOREIGN KEY `Reaction_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Verses` DROP FOREIGN KEY `Verses_chapterId_fkey`;

-- DropForeignKey
ALTER TABLE `Verses` DROP FOREIGN KEY `Verses_translationId_fkey`;

-- DropForeignKey
ALTER TABLE `Video` DROP FOREIGN KEY `Video_userId_fkey`;

-- DropForeignKey
ALTER TABLE `_GameTags` DROP FOREIGN KEY `_GameTags_A_fkey`;

-- DropForeignKey
ALTER TABLE `_GameTags` DROP FOREIGN KEY `_GameTags_B_fkey`;

-- AlterTable
ALTER TABLE `Photo` DROP COLUMN `postId`;

-- DropTable
DROP TABLE `Ad`;

-- DropTable
DROP TABLE `AdImpression`;

-- DropTable
DROP TABLE `Books`;

-- DropTable
DROP TABLE `Chapters`;

-- DropTable
DROP TABLE `CrossReference`;

-- DropTable
DROP TABLE `Devotional`;

-- DropTable
DROP TABLE `Friendship`;

-- DropTable
DROP TABLE `Game`;

-- DropTable
DROP TABLE `Group`;

-- DropTable
DROP TABLE `GroupComment`;

-- DropTable
DROP TABLE `GroupMember`;

-- DropTable
DROP TABLE `GroupPhoto`;

-- DropTable
DROP TABLE `GroupPost`;

-- DropTable
DROP TABLE `GroupReaction`;

-- DropTable
DROP TABLE `GroupVideo`;

-- DropTable
DROP TABLE `HighlightedVerse`;

-- DropTable
DROP TABLE `LikedGame`;

-- DropTable
DROP TABLE `LiveStream`;

-- DropTable
DROP TABLE `Note`;

-- DropTable
DROP TABLE `Place`;

-- DropTable
DROP TABLE `Polemics`;

-- DropTable
DROP TABLE `Post`;

-- DropTable
DROP TABLE `PrayerJournalEntry`;

-- DropTable
DROP TABLE `QuranAyah`;

-- DropTable
DROP TABLE `QuranSurah`;

-- DropTable
DROP TABLE `QuranTranslation`;

-- DropTable
DROP TABLE `Reaction`;

-- DropTable
DROP TABLE `Tag`;

-- DropTable
DROP TABLE `Translation`;

-- DropTable
DROP TABLE `Verses`;

-- DropTable
DROP TABLE `Video`;

-- DropTable
DROP TABLE `WordTranslation`;

-- DropTable
DROP TABLE `_GameTags`;
