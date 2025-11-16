"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useActionState, useState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { postSchema } from "@/app/utils/zodSchemas";
import { CreatePostAction } from "@/app/actions";
import { UploadDropzone } from "@/app/utils/uploadthingComponents";

export default function ArticleCreationRoute() {
  const params = useParams<{ siteId: string }>();
  const siteId = params.siteId;

  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const [lastResult, action] = useActionState(CreatePostAction, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: postSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Button asChild variant="outline" size="icon" className="mr-3">
          <Link href={`/dashboard/sites/${siteId}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">Create article</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Article details</CardTitle>
          <CardDescription>
            Provide the basic information for your new blog article.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id={form.id}
            onSubmit={form.onSubmit}
            action={action}
            className="flex flex-col gap-6"
          >
            {/* Hidden fields for site and placeholders for cover image and article content */}
            <input type="hidden" name="siteId" value={siteId} />
            <input
              type="hidden"
              name={fields.coverImage.name}
              key={fields.coverImage.key}
              value={imageUrl ?? ""}
            />
            <input
              type="hidden"
              name={fields.articleContent.name}
              key={fields.articleContent.key}
              defaultValue={fields.articleContent.initialValue ?? "{}"}
            />

            <div className="grid gap-2">
              <Label>Title</Label>
              <Input
                name={fields.title.name}
                key={fields.title.key}
                defaultValue={fields.title.initialValue}
                placeholder="Next.js blogging application"
              />
              <p className="text-sm text-red-500">{fields.title.errors}</p>
            </div>

            <div className="grid gap-2">
              <Label>Slug</Label>
              <Input
                name={fields.slug.name}
                key={fields.slug.key}
                defaultValue={fields.slug.initialValue}
                placeholder="article-slug"
              />
              <p className="text-sm text-red-500">{fields.slug.errors}</p>
            </div>

            <div className="grid gap-2">
              <Label>Small description</Label>
              <Textarea
                name={fields.smallDescription.name}
                key={fields.smallDescription.key}
                defaultValue={fields.smallDescription.initialValue}
                placeholder="Small description for your blog article..."
                className="h-32"
              />
              <p className="text-sm text-red-500">{fields.smallDescription.errors}</p>
            </div>

            <div className="grid gap-2">
              <Label>Cover image</Label>
              {imageUrl ? (
                <div className="flex flex-col items-start gap-2">
                  <Image
                    src={imageUrl}
                    alt="Uploaded cover image"
                    width={200}
                    height={200}
                    className="w-[200px] h-[200px] object-cover rounded-lg"
                  />
                </div>
              ) : (
                <UploadDropzone
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (!res || res.length === 0) return;
                    setImageUrl(res[0].url);
                  }}
                  onUploadError={(error) => {
                    console.error("Upload error", error);
                  }}
                />
              )}
              <p className="text-sm text-red-500">{fields.coverImage.errors}</p>
            </div>

            <div>
              <Button type="submit">Create article</Button>
            </div>

            {/* Rich text editor will be wired to articleContent later. */}
          </form>
        </CardContent>
      </Card>
    </>
  );
}
