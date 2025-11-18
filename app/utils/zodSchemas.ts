import { z } from "zod";

// export const sitesSchemas = z.object({
//   name: z.string().min(1, "Name must be at least 1 character long").max(50, "Name must be at most 50 characters long"),
//   description: z.string().min(10, "Description must be at least 10 characters long").max(200, "Description must be at most 200 characters long"),
//   subdirectory: z.string().min(3, "Subdirectory must be at least 3 characters long").max(100, "Subdirectory must be at most 100 characters long"),
// });
export const sitesSchemas = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  subdirectory: z.string().min(1, { message: "Subdirectory is required" }),
});

// Schéma avancé pour la création de site avec validation asynchrone du subdirectory
export function siteCreationSchema(options?: {
  isSubdirectoryUnique?: (subdirectory: string) => Promise<boolean>;
}) {
  return z
    .object({
      subdirectory: z
        .string()
        .min(1)
        .max(40)
        .regex(/^[a-z]+$/, {
          message: "Subdirectory must only use lower case letters",
        })
        .transform((value) => value.toLowerCase())
        .pipe(
          z.string().superRefine((value, ctx) => {
            if (typeof options?.isSubdirectoryUnique !== "function") {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Undefined validation function for subdirectory",
                fatal: true,
              });
              return;
            }

            return options.isSubdirectoryUnique(value).then((isUnique) => {
              if (!isUnique) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: "Subdirectory is already taken...",
                });
              }
            });
          }),
        ),
      name: z.string().min(1, { message: "Name is required" }),
      description: z.string().min(1, { message: "Description is required" }),
    });
}
export const postSchema = z.object({
  title: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  coverImage: z.string().min(1),
  smallDescription: z.string().min(1).max(200),
  articleContent: z.string().min(1),
});

// pourquoi le gars n'a pas exporte le schema directement ? pa
// export type sitesSchema = z.infer<typeof sitesSchemas>;
// apres la creation de notre schema nous allons exporter le type inferé de notre schema pour l'utiliser dans notre application Next.js, exactement dans le fichier app/actions.ts