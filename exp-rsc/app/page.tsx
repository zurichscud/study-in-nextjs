import DailyImage from "./components/daily-image";
import MessageForm from "./components/message-form";
import MessageList from "./components/message-list";
import { listMessages } from "./lib/store";
import { TIME_ZONE } from "./lib/time";

export default async function Home() {
  const messages = await listMessages();
  const today = new Date().toLocaleDateString("zh-CN", {
    dateStyle: "full",
    timeZone: TIME_ZONE,
  });

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 px-6 py-16 font-sans">
      <header>
        <h1 className="text-4xl font-semibold tracking-tight">{today}</h1>
      </header>

      <section>
        <DailyImage />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold tracking-tight">留言板</h2>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {messages.length} 条留言
          </span>
        </div>
        <MessageForm />
        <MessageList messages={messages} />
      </section>
    </main>
  );
}
