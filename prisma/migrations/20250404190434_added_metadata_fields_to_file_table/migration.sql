/*
  Warnings:

  - You are about to drop the column `url` on the `Files` table. All the data in the column will be lost.
  - Added the required column `mimeType` to the `Files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storagePath` to the `Files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `Files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Files" DROP COLUMN "url",
ADD COLUMN     "mimeType" TEXT NOT NULL,
ADD COLUMN     "storagePath" TEXT NOT NULL,
ADD COLUMN     "userID" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Files" ADD CONSTRAINT "Files_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
