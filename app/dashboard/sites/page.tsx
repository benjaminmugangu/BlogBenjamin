import { FileIcon, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import prisma from "@/app/utils/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function SitesRoute() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
        redirect("/api/auth/login");
    }

    const sites = await prisma.site.findMany({
        where: {
            userId: user!.id,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <>
            <div className="flex w-full justify-end ">
                <Button asChild>
                    <Link href={"/dashboard/sites/new"}>
                        <PlusCircle className="mr-2 size-4" />Create Site
                    </Link>
                </Button>
            </div>

            {sites.length === 0 ? (
                <div className=" flex flex-col items-center justify-center rounded-md
        border border-dashed p-8 text-center animate-in fade-in-50">
                    <div className="flex size-20 items-center justify-center rounded-full
            bg-primary/10">
                        <FileIcon className="size-10 text-primary" />
                    </div>
                    <h2 className="mt-6 text-xl font-semibold">
                        You have any Sites created yet?
                    </h2>

                    <p className="mb-8 mt-2 text-center text-sm leading-tight
            text-muted-foreground max-w-sm mx-auto">You currently have no Sites created. Please create so that you
                        can see them right here.
                    </p>
                    <Button asChild>
                        <Link href={"/dashboard/sites/new"}>
                            <PlusCircle className="mr-2 size-4" />Create Site
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {sites.map((site) => (
                        <Card key={site.id}>
                            <CardHeader>
                                <CardTitle>{site.name}</CardTitle>
                                <CardDescription>
                                    {site.description}
                                    <br />
                                    <span className="text-xs text-muted-foreground">
                                        /{site.subdirectory}
                                    </span>
                                </CardDescription>
                                <div className="mt-4">
                                    <Button asChild variant="secondary" size="sm">
                                        <Link href={`/dashboard/sites/${site.id}`}>
                                            View site
                                        </Link>
                                    </Button>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )}
        </>
    );
}
