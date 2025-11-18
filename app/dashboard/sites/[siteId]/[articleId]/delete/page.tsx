import Link from "next/link";
import { notFound } from "next/navigation";

import prisma from "@/app/utils/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { deletePost } from "@/app/actions";

async function getData(articleId: string) {
  const data = await prisma.post.findUnique({
    where: { id: articleId },
    select: {
      id: true,
      title: true,
      siteId: true,
    },
  });

  if (!data) {
    notFound();
  }

  return data;
}

export default async function DeleteArticleRoute({
  params,
}: {
  params: Promise<{ siteId: string; articleId: string }>;
}) {
  const { siteId, articleId } = await params;

  const data = await getData(articleId);

  return (
    <div className="flex flex-col gap-6">
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Delete article</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete the article
            <span className="font-semibold"> {data.title}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={deletePost} className="flex flex-col gap-4">
            <input type="hidden" name="siteId" value={siteId} />
            <input type="hidden" name="articleId" value={articleId} />

            <div className="flex flex-wrap gap-3">
              <Button type="submit" variant="destructive">
                Delete article
              </Button>
              <Button asChild variant="outline">
                <Link href={`/dashboard/sites/${siteId}`}>
                  Cancel
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
