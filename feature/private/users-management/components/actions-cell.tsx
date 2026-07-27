"use client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { UserData } from "@/constants/users-management";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ActionsCell({ user }: { user: UserData }) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(user.status === "Active");

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        className="text-primary hover:bg-primary/10 h-8 w-8 rounded-lg transition-colors"
        onClick={() => router.push(`/users-management/${user.id}`)}
        title="View user details"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Switch
        checked={isActive}
        onCheckedChange={setIsActive}
        className="data-[state=checked]:bg-green-500"
      />
    </div>
  );
}
