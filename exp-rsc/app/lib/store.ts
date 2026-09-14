import { connection } from "next/server";

export type Message = {
  id: string;
  name: string;
  content: string;
  createdAt: string;
};

const messages: Message[] = [
  {
    id: "seed-1",
    name: "小明",
    content: "这个留言板是用 Server Component 渲染的，刷新页面也不会丢。",
    createdAt: "2026-09-12T02:30:00.000Z",
  },
  {
    id: "seed-2",
    name: "小红",
    content: "提交留言走的是 Server Action，提交后页面会自动刷新。",
    createdAt: "2026-09-12T03:15:00.000Z",
  },
];

export async function listMessages(): Promise<Message[]> {
  await connection();
  return [...messages].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addMessage(name: string, content: string): Message {
  const message: Message = {
    id: crypto.randomUUID(),
    name,
    content,
    createdAt: new Date().toISOString(),
  };
  messages.push(message);
  return message;
}
