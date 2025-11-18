"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import slugify from "react-slugify";
import { Atom } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/app/utils/uploadthingComponents";
import { toast } from "sonner";
import EditorWrapper from "@/app/components/dashboard/EditorWrapper";
import { SubmitButton } from "@/app/components/dashboard/SubmitButton";
import { postSchema } from "@/app/utils/zodSchemas";
import { editPostAction } from "@/app/actions";

// Type pour le contenu JSON de l'éditeur
type JSONContent = {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: JSONContent[];
  marks?: {
    type: string;
    attrs?: Record<string, unknown>;
  }[];
  text?: string;
};

interface EditArticleFormProps {
  data: {
    id: string;
    title: string;
    slug: string;
    smallDescription: string;
    image: string;
    articleContent: unknown;
    siteId: string;
  };
}

export default function EditArticleForm({ data }: EditArticleFormProps) {
  const [lastResult, action] = useActionState(editPostAction, undefined);

  const [imageUrl, setImageUrl] = useState<string | undefined>(data.image ?? undefined);
  const [value, setValue] = useState<JSONContent | undefined>(data.articleContent as JSONContent);
  const [title, setTitle] = useState<string | undefined>(data.title);
  const [slugValue, setSlugValue] = useState<string | undefined>(data.slug);

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

  const handleSlugGeneration = () => {
    const titleInput = title;

    if (!titleInput || titleInput.length === 0) {
      return toast.error("Please create a title first");
    }

    setSlugValue(slugify(titleInput));
    toast.success("Slug has been created");
  };

  return (
    <Card className="mt-5">
      <CardHeader>
        <CardTitle>Article details</CardTitle>
        <CardDescription>
          Edit the information of your blog article.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id={form.id}
          onSubmit={form.onSubmit}
          action={action}
          className="flex flex-col gap-6"
        >
          {/* Hidden fields for site, article id, cover image and article content */}
          <input type="hidden" name="siteId" value={data.siteId} />
          <input type="hidden" name="articleId" value={data.id} />
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
            value={JSON.stringify(value ?? {})}
          />

          <div className="grid gap-2">
            <Label>Title</Label>
            <Input
              name={fields.title.name}
              key={fields.title.key}
              defaultValue={fields.title.initialValue}
              placeholder="Next.js blogging application"
              value={title ?? ""}
              onChange={(e) => setTitle(e.target.value)}
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
              value={slugValue ?? ""}
              onChange={(e) => setSlugValue(e.target.value)}
            />
            <Button
              type="button"
              variant="secondary"
              className="w-fit"
              onClick={handleSlugGeneration}
            >
              <Atom className="size-4 mr-2" />
              Generate slug
            </Button>
            <p className="text-sm text-red-500">{fields.slug.errors}</p>
          </div>

          <div className="grid gap-2">
            <Label>Small description</Label>
            <Textarea
              name={fields.smallDescription.name}
              key={fields.smallDescription.key}
              defaultValue={data.smallDescription}
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
                  className="w-full max-w-[200px] h-auto aspect-square object-cover rounded-lg"
                />
              </div>
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
            <p className="text-sm text-red-500">{fields.coverImage.errors}</p>
          </div>

          <div className="grid gap-2">
            <Label>Article Content</Label>
            <EditorWrapper
              initialValue={value}
              onChange={setValue}
            />
            <p className="text-sm text-red-500">{fields.articleContent.errors}</p>
          </div>

          <div>
            <SubmitButton text="Edit article" />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}