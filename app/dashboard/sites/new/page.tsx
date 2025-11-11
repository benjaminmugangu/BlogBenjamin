import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";

export default function NewSiteRoute() {
    return (
        <div className="flex flex-col flex-1 items-center pt-8">
            <Card className="max-w-[450px]">
                <CardHeader>
                    <CardTitle>
                        Create your Site here. Click the button below once your done...
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-y-4">
                        <div className="grid gap-2">
                            <Label>Site Name</Label>
                            <Input placeholder="Site Name" />
                        </div>

                        <div className="grid gap-2">
                            <Label>Subdirectory</Label>
                            <Input placeholder="Subdirectory" />
                        </div>

                        <div className="grid gap-2">
                            <Label>Description</Label>
                            <Textarea placeholder="Small description for your site" />
                        </div>
                    </div>

                </CardContent>
                <CardFooter>
                    <Button type="submit">Submit</Button>
                </CardFooter>
            </Card>
        </div>
    );
}