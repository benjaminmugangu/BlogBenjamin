import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Book, FileIcon, PlusCircle, Settings, MoreHorizontal } from "lucide-react";
import prisma from "@/app/utils/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

async function getData(userId: string, siteId: string) {
  const [site, posts] = await Promise.all([
    prisma.site.findUnique({
      where: {
        id: siteId,
        userId: userId,
      },
      select: {
        subdirectory: true,
      },
    }),
    prisma.post.findMany({
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
    }),
  ]);

  return { site, posts };
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

  const { site, posts } = await getData(user.id, siteId);

  if (!site) {
    redirect("/dashboard/sites");
  }

  return (
    <>
      <div className="flex w-full justify-end gap-4">
        <Button asChild variant="secondary">
          <Link href={`/blog/${site.subdirectory}`} target="_blank">
            <Book className="size-4 mr-2" />
            View blog
          </Link>
        </Button>

        <Button asChild variant="secondary">
          <Link href={`/dashboard/sites/${siteId}/settings`}>
            <Settings className="size-4 mr-2" />
            Settings
          </Link>
        </Button>

        <Button asChild>
          <Link href={`/dashboard/sites/${siteId}/create`}>
            <PlusCircle className="size-4 mr-2" />
            Create article
          </Link>
        </Button>
      </div>

      {(!posts || posts.length === 0) ? (
        <div className="flex flex-col items-center justify-center h-full">
          <FileIcon className="size-6 mb-4" />
          <h1 className="text-lg font-semibold mb-2">No articles yet</h1>
          <p className="text-gray-500 mb-4">Create your first article to get started</p>
          <Button asChild>
            <Link href={`/dashboard/sites/${siteId}/create`}>
              <PlusCircle className="size-4 mr-2" />
              Create article
            </Link>
          </Button>
        </div>
      ) : (
        <Card className="mt-5">
          <CardHeader>
            <CardTitle>Articles</CardTitle>
            <CardDescription>
              Manage your articles in a simple and intuitive interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Image</th>
                    <th className="text-left p-4 font-medium">Title</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Created At</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post: any) => (
                    <tr key={post.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <Image
                          src={post.image || "/default.png"}
                          alt={post.title}
                          width={64}
                          height={64}
                          className="size-16 rounded-md object-cover"
                        />
                      </td>
                      <td className="p-4 font-medium">{post.title}</td>
                      <td className="p-4">
                        <Badge variant="outline" className="bg-green-500/10 text-green-500">
                          Published
                        </Badge>
                      </td>
                      <td className="p-4">
                        {new Intl.DateTimeFormat("en-US", {
                          dateStyle: "medium",
                        }).format(post.createdAt)}
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/sites/${siteId}/articles/${post.id}`}>
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/sites/${siteId}/articles/${post.id}/delete`}>
                                Delete
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
