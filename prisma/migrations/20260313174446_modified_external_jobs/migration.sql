/*
  Warnings:

  - You are about to drop the column `aiDraft` on the `ExternalJob` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[url]` on the table `ExternalJob` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `ExternalJob` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExternalJob" DROP COLUMN "aiDraft",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "platform" SET DEFAULT 'LinkedIn',
ALTER COLUMN "status" SET DEFAULT 'FOUND';

-- CreateIndex
CREATE UNIQUE INDEX "ExternalJob_url_key" ON "ExternalJob"("url");

-- CreateIndex
CREATE INDEX "ExternalJob_studentId_idx" ON "ExternalJob"("studentId");

-- AddForeignKey
ALTER TABLE "ExternalJob" ADD CONSTRAINT "ExternalJob_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
