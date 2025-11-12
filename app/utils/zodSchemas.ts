import { z } from "zod";

export const sitesSchemas = z.object({
  name: z.string().min(1, "Name must be at least 1 character long").max(50, "Name must be at most 50 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long").max(200, "Description must be at most 200 characters long"),
  subdirectory: z.string().min(3, "Subdirectory must be at least 3 characters long").max(100, "Subdirectory must be at most 100 characters long"),
});

// pourquoi le gars n'a pas exporte le schema directement ? pa
// export type sitesSchema = z.infer<typeof sitesSchemas>;
// apres la creation de notre schema nous allons exporter le type inferé de notre schema pour l'utiliser dans notre application Next.js, exactement dans le fichier app/actions.ts