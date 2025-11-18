import { PlusCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import prisma from "@/app/utils/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import EmptyState from "@/app/components/dashboard/EmptyState";
import type { Site } from "@prisma/client";

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
                <EmptyState
                    title="You don't have any sites created yet"
                    description="You currently have no sites created. Please create one so that you can see it here."
                    buttonText="Create site"
                    href="/dashboard/sites/new"
                />
            ) : (
                <div className="mt-8 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                    {sites.map((site: Site) => (
                        <Card key={site.id}>
                            <CardHeader>
                                <div className="mb-4">
                                    <Image
                                        src={site.imageUrl || "/default.png"}
                                        alt={site.name}
                                        width={400}
                                        height={200}
                                        className="w-full h-40 object-cover rounded-md"
                                    />
                                </div>
                                <CardTitle className="truncate">{site.name}</CardTitle>
                                <CardDescription className="line-clamp-3">
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
