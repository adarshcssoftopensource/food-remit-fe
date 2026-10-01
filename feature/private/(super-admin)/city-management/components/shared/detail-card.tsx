import { type ReactNode } from "react";

export const DetailCard = ({ label, value }: { label: string; value?: ReactNode }) => (
  <div className="rounded-xl bg-slate-50 p-3 transition hover:bg-slate-100">
    <p className="text-xs font-medium text-slate-500">{label}</p>
    <div className="mt-1 text-sm font-semibold text-slate-900">{value || "-"}</div>
  </div>
);
