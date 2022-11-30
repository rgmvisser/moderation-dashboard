-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_topicId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_contentId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_contentId_fkey";

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
