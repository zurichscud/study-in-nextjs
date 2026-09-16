"use client";

import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

const messages: Record<string, string> = {
  updated: "Invoice updated successfully",
};

export default function Toast({ status }: { status?: string }) {
  const [visible, setVisible] = useState(true);
  const message = status ? messages[status] : undefined;

  useEffect(() => {
    if (!message) return;

    const url = new URL(window.location.href);
    url.searchParams.delete("status");
    window.history.replaceState(null, "", url);

    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  if (!message || !visible) return null;

  return (
    <div
      role="status"
      className="fixed bottom-6 right-6 z-50 flex animate-[toast-in_0.3s_ease-out] items-center gap-3 rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-lg"
    >
      <CheckCircleIcon className="h-5 w-5 shrink-0" />
      <p>{message}</p>
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Dismiss"
        className="rounded p-0.5 transition-colors hover:bg-green-700"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
