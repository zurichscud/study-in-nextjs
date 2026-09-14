"use client";

import { useActionState, useEffect, useRef } from "react";
import { createMessage, type FormState } from "../lib/actions";

const initialState: FormState = {};

export default function MessageForm() {
  const [state, formAction, pending] = useActionState(
    createMessage,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <input
        type="text"
        name="name"
        required
        maxLength={20}
        placeholder="你的昵称"
        className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400"
      />
      <textarea
        name="content"
        required
        maxLength={200}
        rows={3}
        placeholder="写点什么吧……"
        className="w-full resize-none rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400"
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {state.error}
        </p>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {pending ? "提交中…" : "提交留言"}
        </button>
      </div>
    </form>
  );
}
