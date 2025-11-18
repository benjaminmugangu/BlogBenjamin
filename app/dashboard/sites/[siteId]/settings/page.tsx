import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import UploadImageForm from "@/app/components/dashboard/forms/UploadImageForm";
import { SubmitButton } from "@/app/components/dashboard/SubmitButton";
import { deleteSite } from "@/app/actions";

export default async function SiteSettingsRoute({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;

  return (
    <>
      {/* Top section: back button + title */}
      <div className="flex items-center gap-2 mb-6">
        <Button asChild variant="outline" size="icon">
          <Link href={`/dashboard/sites/${siteId}`}>
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
        <h3 className="text-xl font-semibold">Go back</h3>
      </div>

      <div className="flex flex-col gap-6">
        {/* Card for uploading/changing site image */}
        <UploadImageForm siteId={siteId} />

        {/* Danger card for deleting the site */}
        <Card className="border-red-500 bg-red-500/10">
          <CardHeader>
            <CardTitle className="text-red-500">Danger</CardTitle>
            <CardDescription>
              This will delete your site and all articles associated with it. Click the
              button below to delete everything.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <form action={deleteSite} className="w-full">
              <input type="hidden" name="siteId" value={siteId} />
              <SubmitButton text="Delete everything" variant="destructive" />
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
