import { Button } from "@/components/ui/button";
import { Save, Send } from "lucide-react";

type Props = {
  loading?: boolean;
};

export function FormActions({ loading }: Props) {
  return (
    <div className="flex flex-wrap justify-end gap-3 border-t pt-4">
      <Button type="button" variant="outline">
        Cancel
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
