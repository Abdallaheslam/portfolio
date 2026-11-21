export default function SectionDivider() {
  return (
    <div aria-hidden="true" className="mx-auto max-w-6xl px-6">
      <div className="relative h-px w-full bg-gradient-to-r from-transparent via-slate-300/80 to-transparent dark:via-white/[0.12]">
        <div className="mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500/45 to-transparent dark:via-blue-400/40" />
      </div>
    </div>
  );
}
