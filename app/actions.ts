"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { sitesSchemas, postSchema } from "./utils/zodSchemas";
import prisma from "./utils/db";
// import { Prisma } from "@prisma/client"; // nécessaire pour le type unchecked

async function requireUser() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    redirect("/api/auth/login");
  }

  return user;
}

// la premiere modification

// export async function CreateSiteAction(prevState: unknown, formData: FormData) {
//   // Récupération de l'utilisateur connecté
//   const user = await requireUser();

//   // Validation du formulaire
//   const submission = parseWithZod(formData, {
//     schema: sitesSchemas,
//   });

//   if (submission.status !== "success") {
//     return submission.reply();
//   }

//   const existingSite = await prisma.site.findUnique({
//     where: {
//       subdirectory: submission.value.subdirectory,
//     },
//   });

//   if (existingSite) {
//     return submission.reply({
//       fieldErrors: {
//         subdirectory: ["This subdirectory is already taken. Please choose another one."],
//       },
//     });
//   }

//   // Création du site avec l'ID de l'utilisateur (unchecked)
//   await prisma.site.create({
//     data: {
//       name: submission.value.name,
//       description: submission.value.description,
//       subdirectory: submission.value.subdirectory,
//       userId: user.id, // passe directement l'ID
//     } as Prisma.SiteUncheckedCreateInput, // ← cast pour TypeScript
//   });

//   return redirect("/dashboard/sites");
// }

export async function CreateSiteAction(
  previousState: unknown,
  formData: FormData
) {
  const user = await requireUser();

  const submission = parseWithZod(formData, {
    schema: sitesSchemas,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.site.create({
    data: {
      name: submission.value.name,
      description: submission.value.description,
      subdirectory: submission.value.subdirectory,
      userId: user.id,
    },
  });

  return redirect("/dashboard/sites");
}

export async function CreatePostAction(prevState: unknown, formData: FormData) {
  const user = await requireUser();

  const submission = parseWithZod(formData, {
    schema: postSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const siteId = formData.get("siteId") as string;

  // Sécurisation multi-tenant : on vérifie bien que ce site appartient à cet utilisateur !
  const site = await prisma.site.findUnique({
    where: { id: siteId, userId: user.id },
  });
  if (!site) {
    // UX friendly: retour d'une erreur au formulaire
    return submission.reply({
      formErrors: ["Vous n'êtes pas autorisé à ajouter un article sur ce site (erreur de sécurité)."],
    });
  }

  await prisma.post.create({
    data: {
      title: submission.value.title,
      smallDescription: submission.value.smallDescription,
      slug: submission.value.slug,
      articleContent: JSON.parse(submission.value.articleContent),
      image: submission.value.coverImage,
      userId: user.id,
      siteId,
    },
  });

  return redirect(`/dashboard/sites/${siteId}`);
}
