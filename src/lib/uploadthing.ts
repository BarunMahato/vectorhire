import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers, // Add this import
} from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

// This line creates the useUploadThing hook for your components
export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();