"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useActionState, useState, useEffect } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import EditorWrapper from "@/app/components/dashboard/EditorWrapper";
import slugify from "react-slugify";
import { Atom } from "lucide-react";

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

import { postSchema } from "@/app/utils/zodSchemas";
import { CreatePostAction } from "@/app/actions";
import { UploadDropzone } from "@/app/utils/uploadthingComponents";
import { toast } from "sonner";
import { SubmitButton } from "@/app/components/dashboard/SubmitButton";

export default function ArticleCreationRoute() {
  const params = useParams<{ siteId: string }>();
  const siteId = params.siteId;

  const [lastResult, action] = useActionState(CreatePostAction, undefined);

  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  // States pour l'éditeur, le titre et le slug selon le tutoriel
  const [value, setValue] = useState<JSONContent | undefined>(undefined);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [slugValue, setSlugValue] = useState<string | undefined>(undefined);

  // Nettoyer localStorage après soumission réussie (redirection = succès)
  useEffect(() => {
    // Si lastResult existe et n'a pas d'erreur, c'est un succès (redirection)
    // On nettoie le localStorage pour éviter de garder l'image
    // Note: En cas de redirection, lastResult peut être undefined, donc on se base sur la redirection
  }, [lastResult, siteId]);

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

  // Afficher un toast d'erreur global UNIQUEMENT pour les erreurs inattendues du serveur
  useEffect(() => {
    if (!lastResult) return;

    // Vérifier si lastResult contient des erreurs de formulaire (formErrors)
    const hasFormErrors = 
      lastResult && 
      typeof lastResult === "object" && 
      "error" in lastResult &&
      (lastResult as { error?: { formErrors?: string[] } }).error?.formErrors;

    if (hasFormErrors) {
      const error = (lastResult as { error: { formErrors: string[] } }).error;
      const errorMessage = error.formErrors?.[0];
      // Afficher toast uniquement pour les erreurs inattendues (pas pour les erreurs de validation)
      if (errorMessage && (
        errorMessage.toLowerCase().includes("unexpected error") || 
        errorMessage.toLowerCase().includes("an unexpected error") ||
        errorMessage.toLowerCase().includes("try again")
      )) {
        toast.error(errorMessage);
      }
    }
  }, [lastResult]);

  // Fonction de génération de slug selon le tutoriel
  const handleSlugGeneration = () => {
    const titleInput = title;
    
    if (!titleInput || titleInput.length === 0) {
      return toast.error("Please create a title first");
    }
    
    setSlugValue(slugify(titleInput));
    toast.success("Slug has been created");
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6 flex-wrap">
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
              <SubmitButton text="Create article" />
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
