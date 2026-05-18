import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // Endpoint for the delivery confirmation photo
  deliveryPhoto: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      // Allow public anonymous uploads since drivers are not logged in
      return { uploadedBy: "anonymous_driver" };
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Delivery photo uploaded. File URL:", file.ufsUrl);
      return { url: file.ufsUrl };
    }),

  // Endpoint for the drawn signature canvas
  signatureImage: f({ image: { maxFileSize: "1MB", maxFileCount: 1 } })
    .middleware(async () => {
      // Allow public anonymous uploads since clients/drivers are not logged in
      return { uploadedBy: "anonymous_client" };
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Signature uploaded. File URL:", file.ufsUrl);
      return { url: file.ufsUrl };
    }),

  // Endpoint for personal avatar (Free & Premium)
  personalAvatar: f({ image: { maxFileSize: "1MB", maxFileCount: 1 } })
    .middleware(async () => {
      return { uploadedBy: "dashboard_user" };
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Avatar uploaded. File URL:", file.ufsUrl);
      return { url: file.ufsUrl };
    }),

  // Endpoint for the premium custom branding logo
  companyLogo: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async () => {
      // In a real app we'd check session here, but to avoid circular deps
      // we'll allow it and restrict the saving of the URL in the server action.
      return { uploadedBy: "dashboard_user" };
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Company logo uploaded. File URL:", file.ufsUrl);
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
