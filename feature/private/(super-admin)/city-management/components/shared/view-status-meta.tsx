type ViewStatusMetaProps = {
  status: React.ReactNode;
  dateLabel: string;
  dateValue: React.ReactNode;
};

export function ViewStatusMeta({ status, dateLabel, dateValue }: ViewStatusMetaProps) {
  return (
    <div className="flex shrink-0 gap-3 text-right">
      <div>
        <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Status</p>
        <p className="mt-0.5 font-medium text-slate-700">{status}</p>
      </div>
      <div className="w-px bg-slate-200" />
      <div>
        <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">{dateLabel}</p>
        <p className="mt-0.5 font-medium text-slate-700">{dateValue}</p>
      </div>
    </div>
  );
}
