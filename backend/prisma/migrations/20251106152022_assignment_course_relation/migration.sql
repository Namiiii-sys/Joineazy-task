/*
  Warnings:

  - Made the column `courseId` on table `Assignment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Assignment" DROP CONSTRAINT "Assignment_courseId_fkey";

-- AlterTable
ALTER TABLE "Assignment" ALTER COLUMN "courseId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
