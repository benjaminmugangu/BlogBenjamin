import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { sitesSchemas } from "./utils/zodSchemas";
import prisma from "./utils/db";
import { Prisma } from "@prisma/client"; // nécessaire pour le type unchecked

export async function CreateSiteAction(formData: FormData) {
  // Récupération de l'utilisateur connecté
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  // Validation du formulaire
  const submission = parseWithZod(formData, {
    schema: sitesSchemas,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  // Création du site avec l'ID de l'utilisateur (unchecked)
  await prisma.site.create({
    data: {
      name: submission.value.name,
      description: submission.value.description,
      subdirectory: submission.value.subdirectory,
      userId: user.id, // passe directement l'ID
    } as Prisma.SiteUncheckedCreateInput, // ← cast pour TypeScript
  });

  return redirect("/dashboard/sites");
}
