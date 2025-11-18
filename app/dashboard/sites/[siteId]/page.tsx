import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Book, PlusCircle, Settings, MoreHorizontal } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmptyState from "@/app/components/dashboard/EmptyState";

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
      <div className="flex w-full justify-end gap-4 flex-wrap">
        <Button asChild variant="secondary" className="w-full sm:w-auto">
          <Link href={`/blog/${site.subdirectory}`} target="_blank">
            <Book className="size-4 mr-2" />
            View blog
          </Link>
        </Button>

        <Button asChild variant="secondary" className="w-full sm:w-auto">
          <Link href={`/dashboard/sites/${siteId}/settings`}>
            <Settings className="size-4 mr-2" />
            Settings
          </Link>
        </Button>

        <Button asChild className="w-full sm:w-auto">
          <Link href={`/dashboard/sites/${siteId}/create`}>
            <PlusCircle className="size-4 mr-2" />
            Create article
          </Link>
        </Button>
      </div>

      {(!posts || posts.length === 0) ? (
        <EmptyState
          title="You don't have any articles created yet"
          description="You currently don't have any articles. Please create some so that you can see them here."
          buttonText="Create article"
          href={`/dashboard/sites/${siteId}/create`}
        />
      ) : (
        <Card className="mt-5">
          <CardHeader>
            <CardTitle>Articles</CardTitle>
            <CardDescription>
              Manage your articles in a simple and intuitive interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created at</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <Image
                        src={post.image || "/default.png"}
                        alt={post.title}
                        width={64}
                        height={64}
                        className="size-16 rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        Published
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Intl.DateTimeFormat("en-US", {
                        dateStyle: "medium",
                      }).format(post.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
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
                            <Link href={`/dashboard/sites/${siteId}/${post.id}`}>
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/sites/${siteId}/${post.id}/delete`}>
                              Delete
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
}
