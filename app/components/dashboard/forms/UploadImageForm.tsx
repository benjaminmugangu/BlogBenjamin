"use client";

import Image from "next/image";
import { useState } from "react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { UploadDropzone } from "@/app/utils/uploadthingComponents";
import { toast } from "sonner";
import { SubmitButton } from "@/app/components/dashboard/SubmitButton";
import { updateImage } from "@/app/actions";

interface UploadImageFormProps {
  siteId: string;
}

export default function UploadImageForm({ siteId }: UploadImageFormProps) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Image</CardTitle>
        <CardDescription>
          This is the image of your site. You can change it here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Uploaded image"
            width={200}
            height={200}
            className="h-[200px] w-[200px] object-cover rounded-lg"
          />
        ) : (
          <UploadDropzone
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (!res || res.length === 0) return;
              const url = res[0].url;
              setImageUrl(url);
              toast.success("image has been uploaded");
            }}
            onUploadError={() => {
              toast.error("something went wrong...");
            }}
          />
        )}
      </CardContent>
      <CardFooter>
        <form action={updateImage} className="w-full flex justify-start gap-3">
          <input type="hidden" name="siteId" value={siteId} />
          <input type="hidden" name="imageUrl" value={imageUrl ?? ""} />
          <SubmitButton text="Change image" />
        </form>
      </CardFooter>
    </Card>
  );
}
