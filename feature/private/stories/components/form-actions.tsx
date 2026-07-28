import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { Save, Send, X } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  loading?: boolean;
};

export function FormActions({ loading }: Props) {
  const router = useRouter();

  return (
    <div className="flex flex-wrap justify-end gap-3 border-t pt-4">
      <Button type="button" variant="destructive" onClick={() => router.push(ROUTES.STORIES.LIST)}>
        <X /> Cancel
      </Button>

      <Button type="button" variant="outline">
        <Save />
        Save as draft
      </Button>

      <Button type="submit" isLoading={loading}>
        <Send />
        Publish story
      </Button>
    </div>
  );
}
