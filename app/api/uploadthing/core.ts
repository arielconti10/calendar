/** app/api/uploadthing/core.ts */
import { PrismaClient } from "@prisma/client";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 4 } })
    // Set permissions and file types for this FileRoute
    .middleware(async (req) => {
      // This code runs on your server before upload
      const user = await auth(req);

      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const prisma = new PrismaClient();
      const [resourceId, _originalFileName] = file.name.split("_");

      // conver resource id to number
      const resourceIdNumber = parseInt(resourceId);

      // save the file url to the database
      await prisma.image.create({
        data: {
          url: file.url,
          appointment: { connect: { id: resourceIdNumber } },
        },
      });

    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;