"use client";

import { Building2, Loader2 } from "lucide-react";

import { ImageUpload } from "@/components/common/image-upload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATALOGUE_COUNTRY_OPTIONS, DepartmentData } from "@/constants/catalogue-management";
import { DepartmentFormValues, useDepartmentForm } from "../../hooks/useDepartmentForm";

interface DepartmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department?: DepartmentData | null;
  onSubmit?: (values: DepartmentFormValues) => void;
}

export function DepartmentFormDialog({
  open,
  onOpenChange,
  department,
  onSubmit,
}: DepartmentFormDialogProps) {
  const isEditing = !!department;
  const { form, isSubmitting, handleSubmit } = useDepartmentForm(
    open,
    department,
    onOpenChange,
    onSubmit,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-0 shadow-xl">
        <DialogHeader className="bg-muted/20 rounded-2xl border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-11 w-11 items-center justify-center rounded-xl">
              <Building2 className="text-primary h-5 w-5" />
            </div>

            <div>
              <DialogTitle className="text-xl font-bold">
                {isEditing ? "Edit Department" : "Create Department"}
              </DialogTitle>

              <DialogDescription className="text-muted-foreground mt-1 text-sm">
                {isEditing
                  ? "Update the department details."
                  : "Add a new department to your organization."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Select Country <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 w-full rounded-lg">
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATALOGUE_COUNTRY_OPTIONS.filter((o) => o.value !== "all").map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Department Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Department Name"
                      className="h-11 rounded-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="iconFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Department Icon <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <ImageUpload
                      maxFiles={1}
                      value={field.value}
                      onChange={field.onChange}
                      label="Click to upload icon"
                      hint="PNG, JPG, WEBP (Max 1 file)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 border-t pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-11 rounded-xl px-5"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="h-11 rounded-xl px-6">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Update Department" : "Add Department"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
