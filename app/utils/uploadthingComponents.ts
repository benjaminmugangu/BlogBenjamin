import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
import type { AppFileRouter } from "@/app/api/uploadingthing/core";

export const UploadButton = generateUploadButton<AppFileRouter>({
  url: "/api/uploadingthing",
});

export const UploadDropzone = generateUploadDropzone<AppFileRouter>({
  url: "/api/uploadingthing",
});