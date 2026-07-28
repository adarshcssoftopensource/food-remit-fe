import { Card, CardContent } from "@/components/ui/card";

export function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="rounded-2xl border-0 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <CardContent className="flex items-start gap-4 p-5">
        <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-xl">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-muted-foreground text-sm">{label}</p>

          <p className="mt-1 truncate text-base font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
