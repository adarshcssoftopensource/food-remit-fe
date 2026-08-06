"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bell } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { PageHeader } from "@/components/common/page-header";
import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useApiMutation } from "@/hooks/useApi";
import { cn } from "@/lib/utils";
import {
  SendNotificationFormValues,
  sendNotificationSchema,
} from "../schema/send-notification.schema";

export function SendNotificationForm({ className, ...props }: React.ComponentProps<"div">) {
  const { mutateAsync, isPending } = useApiMutation<any, SendNotificationFormValues>(
    "post",
    "/api/send-notification",
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SendNotificationFormValues>({
    resolver: zodResolver(sendNotificationSchema),
    defaultValues: { title: "", userRole: "", message: "" },
    mode: "onChange",
  });

  async function onSubmit(data: SendNotificationFormValues) {
    try {
      await mutateAsync(data);
      successToast({
        title: "",
        description: "Notification sent successfully.",
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div>
        <PageHeader
          title="Send Notifications"
          description="Send notifications to users"
          action={
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50">
              <Bell className="size-6 text-[#1B3A8C]" />
            </div>
          }
        />

        <div className="mt-8">
          <div
            className={cn(
              "w-full rounded-2xl border border-gray-200",
              "bg-white p-6 shadow-sm sm:p-8",
              className,
            )}
            {...props}
          >
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="grid gap-6 lg:grid-cols-2">
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <FieldLabel className="text-sm font-semibold text-gray-700">
                        Title <span className="text-red-500">*</span>
                      </FieldLabel>

                      <Input
                        {...field}
                        placeholder="Enter notification title"
                        className={cn(
                          "h-12 rounded-xl border-gray-200 bg-gray-50",
                          "focus:bg-white focus-visible:border-[#1B3A8C]",
                          errors.title && "border-red-400",
                        )}
                      />

                      {errors.title && (
                        <p className="text-xs text-red-500">{errors.title.message}</p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="userRole"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <FieldLabel className="text-sm font-semibold text-gray-700">
                        User Role <span className="text-red-500">*</span>
                      </FieldLabel>

                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-12! w-full rounded-xl border-gray-200 bg-gray-50 focus:border-[#1B3A8C]">
                          <SelectValue placeholder="Select user role" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="vendor">Vendor</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="philanthropist">Philanthropist</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.userRole && (
                        <p className="text-xs text-red-500">{errors.userRole.message}</p>
                      )}
                    </div>
                  )}
                />

                <div className="lg:col-span-2">
                  <Controller
                    name="message"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <FieldLabel className="text-sm font-semibold text-gray-700">
                          Message <span className="text-red-500">*</span>
                        </FieldLabel>

                        <Textarea
                          {...field}
                          rows={4}
                          placeholder="Enter notification message"
                          className={cn(
                            "rounded-xl border-gray-200",
                            "resize-none bg-gray-50",
                            "focus:bg-white focus-visible:border-[#1B3A8C]",
                            errors.message && "border-red-400",
                          )}
                        />

                        {errors.message && (
                          <p className="text-xs text-red-500">{errors.message.message}</p>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end border-t pt-6">
                <Button
                  type="submit"
                  isLoading={isPending}
                  className="h-12 rounded-xl px-8 font-semibold"
                >
                  <Bell className="mr-2 size-4" />
                  Send Notification
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
