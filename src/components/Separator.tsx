export function Separator({ label }: { label?: string }) {
  return (
    <div className="flex items-center">
      <hr className="border-dotted border-stone-400" />
      {label ? (
        <span className="text-sm text-stone-400 px-3">{label}</span>
      ) : null}
      <hr className="border-dotted border-stone-400" />
    </div>
  );
}
