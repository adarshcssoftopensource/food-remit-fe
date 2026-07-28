import { Controller, useForm } from "react-hook-form";
import { AddStoryFormValues } from "../schema/add-story.schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "./form-input";
import { Input } from "@/components/ui/input";
import { inputClassName } from "@/constants/stories-management";

export function ReferenceCard({
  title,
  prefix,
  control,
  errors,
}: {
  title: string;
  prefix: "referenceOne" | "referenceTwo";
  control: ReturnType<typeof useForm<AddStoryFormValues>>["control"];
  errors:
    | { name?: { message?: string }; email?: { message?: string }; number?: { message?: string } }
    | undefined;
}) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>A contact who can verify this story.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Controller
          name={`${prefix}.name`}
          control={control}
          render={({ field }) => (
            <FormInput label="Name" error={errors?.name?.message}>
              <Input
                {...field}
                placeholder="Full name"
                aria-invalid={!!errors?.name}
                className={inputClassName}
              />
            </FormInput>
          )}
        />

        <Controller
          name={`${prefix}.email`}
          control={control}
          render={({ field }) => (
            <FormInput label="Email" error={errors?.email?.message}>
              <Input
                {...field}
                type="email"
                placeholder="name@email.com"
                aria-invalid={!!errors?.email}
                className={inputClassName}
              />
            </FormInput>
          )}
        />

        <Controller
          name={`${prefix}.number`}
          control={control}
          render={({ field }) => (
            <FormInput label="Contact number" error={errors?.number?.message}>
              <Input
                {...field}
                inputMode="tel"
                placeholder="Contact number"
                aria-invalid={!!errors?.number}
                className={inputClassName}
              />
            </FormInput>
          )}
        />
      </CardContent>
    </Card>
  );
}
