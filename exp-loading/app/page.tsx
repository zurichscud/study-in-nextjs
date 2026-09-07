import { Suspense } from "react";
import Advice from "./components/Advice";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center gap-8 py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          I want to tell you
        </h1>
        <Suspense fallback={<div>Loading...</div>}>
          <Advice />
        </Suspense>
      </main>
    </div>
  );
}
