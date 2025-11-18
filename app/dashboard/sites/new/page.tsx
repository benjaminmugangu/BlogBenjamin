"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-dropdown-menu";
import { SubmitButton } from "@/app/components/dashboard/SubmitButton";
import { useActionState } from "react";
import { useForm } from "@conform-to/react";
import { sitesSchemas } from "@/app/utils/zodSchemas";
import { parseWithZod } from "@conform-to/zod";
import { CreateSiteAction } from "@/app/actions";


export default function NewSiteRoute() {
    const [lastResult, action] = useActionState(CreateSiteAction, undefined);
    const [form, fields] = useForm({
        lastResult,

        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: sitesSchemas,
            });
        },

        shouldValidate: "onBlur",
        shouldRevalidate: "onInput",
    });
    return (
        <div className="flex flex-col flex-1 items-center">
            <Card className="max-w-[450px]">
                <CardHeader>
                    <CardTitle>
                        <CardDescription>
                            Create your Site here. Click the button below once your done...
                        </CardDescription>
                    </CardTitle>
                </CardHeader>
                <form id={form.id} onSubmit={form.onSubmit} action={action}>
                    <CardContent>
                        <div className="flex flex-col gap-y-6">
                            <div className="grid gap-2">
                                <Label>Site Name</Label>
                                <Input 
                                name={fields.name.name}
                                key={fields.name.key}
                                defaultValue={fields.name.initialValue}  
                                placeholder="Site Name" 
                                />
                                <p className="text-red-500 text-sm">{fields.name.errors}</p>
                            </div>

                            <div className="grid gap-2">
                                <Label>Subdirectory</Label>
                                <Input
                                    name={fields.subdirectory?.name}
                                    key={fields.subdirectory?.key}
                                    defaultValue={fields.subdirectory?.initialValue}
                                    placeholder="Subdirectory"
                                />
                                <p className="text-red-500 text-sm">{fields.subdirectory?.errors}</p>
                            </div>

                            <div className="grid gap-2">
                                <Label>Description</Label>
                                <Textarea
                                    name={fields.description?.name}
                                    key={fields.description?.key}
                                    defaultValue={fields.description?.initialValue}
                                    placeholder="Small description for your site"
                                />
                                <p className="text-red-500 text-sm">{fields.description?.errors}</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <SubmitButton text="Create site" />
                    </CardFooter>
                </form>
 
            </Card>
        </div>
    );
}