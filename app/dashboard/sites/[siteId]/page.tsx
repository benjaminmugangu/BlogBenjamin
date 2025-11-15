import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Book, PlusCircle, Settings } from "lucide-react";
import prisma from "@/app/utils/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

async function getData(userId: string, siteId: string) {
  const data = await prisma.post.findMany({
    where: {
      userId,
      siteId,
    },
    select: {
      id: true,
      image: true,
      title: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}

export default async function SiteRoute({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    redirect("/api/auth/login");
  }

  const data = await getData(user.id, siteId);

  return (
    <>
      <div className="flex w-full justify-end gap-4">
        <Button asChild variant="secondary">
          <Link href="#">
            <Book className="size-4 mr-2" />
            View blog
          </Link>
        </Button>

        <Button asChild variant="secondary">
          <Link href="#">
            <Settings className="size-4 mr-2" />
            Settings
          </Link>
        </Button>

        <Button asChild>
          <Link href="#">
            <PlusCircle className="size-4 mr-2" />
            Create article
          </Link>
        </Button>
      </div>

      {(!data || data.length === 0) ? (
        <h1 className="mt-8 text-center text-xl font-semibold">Empty</h1>
      ) : (
        <h1 className="mt-8 text-center text-xl font-semibold">Here is data</h1>
      )}
    </>
  );
}
