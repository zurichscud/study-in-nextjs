"use server";

import { refresh } from "next/cache";
import { addMessage } from "./store";

export type FormState = {
  error?: string;
  ok?: boolean;
};

const MAX_NAME_LENGTH = 20;
const MAX_CONTENT_LENGTH = 200;

export async function createMessage(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!name) {
    return { error: "请填写昵称" };
  }
  if (name.length > MAX_NAME_LENGTH) {
    return { error: `昵称不能超过 ${MAX_NAME_LENGTH} 个字符` };
  }
  if (!content) {
    return { error: "请填写留言内容" };
  }
  if (content.length > MAX_CONTENT_LENGTH) {
    return { error: `留言内容不能超过 ${MAX_CONTENT_LENGTH} 个字符` };
  }

  addMessage(name, content);
  refresh();

  return { ok: true };
}
