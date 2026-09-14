import type { Message } from "../lib/store";
import { TIME_ZONE } from "../lib/time";

const formatter = new Intl.DateTimeFormat("zh-CN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: TIME_ZONE,
});

export default function MessageList({ messages }: { messages: Message[] }) {
  if (messages.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        还没有留言，来抢沙发吧。
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {messages.map((message) => (
        <li
          key={message.id}
          className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
              {message.name.slice(0, 1)}
            </span>
            <div className="flex flex-1 items-baseline justify-between gap-2">
              <span className="text-sm font-medium">{message.name}</span>
              <time
                dateTime={message.createdAt}
                className="text-xs text-zinc-400"
              >
                {formatter.format(new Date(message.createdAt))}
              </time>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
            {message.content}
          </p>
        </li>
      ))}
    </ul>
  );
}
