export default function Loading() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 bg-zinc-50 font-sans dark:bg-black">
      <div className="flex w-full max-w-3xl flex-col items-center gap-8 py-16">
        <div className="h-9 w-48 animate-pulse rounded bg-black/[.08] dark:bg-white/[.145]" />
        <div className="flex w-full flex-col items-center gap-4 rounded-2xl border border-black/[.08] px-8 py-10 dark:border-white/[.145]">
          <div className="h-4 w-20 animate-pulse rounded bg-black/[.08] dark:bg-white/[.145]" />
          <div className="h-6 w-full max-w-md animate-pulse rounded bg-black/[.08] dark:bg-white/[.145]" />
        </div>
      </div>
    </div>
  );
}
