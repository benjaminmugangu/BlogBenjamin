import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import prisma from "@/app/utils/db";
import { Button } from "@/components/ui/button";
import EditArticleForm from "@/app/components/dashboard/forms/EditArticleForm";

async function getData(articleId: string) {
  const data = await prisma.post.findUnique({
    where: { id: articleId },
    select: {
      id: true,
      title: true,
      slug: true,
      smallDescription: true,
      image: true,
      articleContent: true,
      siteId: true,
    },
  });

  if (!data) {
    notFound();
  }

  return data;
}

export default async function ArticleEditRoute({
  params,
}: {
  params: Promise<{ siteId: string; articleId: string }>;
}) {
  const { siteId, articleId } = await params;

  const data = await getData(articleId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <Button asChild variant="outline" size="icon" className="mr-3">
          <Link href={`/dashboard/sites/${siteId}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">Edit article</h1>
      </div>

      <EditArticleForm data={data} />
    </div>
  );
}
