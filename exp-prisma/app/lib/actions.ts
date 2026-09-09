"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";

export type ActionResult = {
  ok: boolean;
  message: string;
};

function toResult(e: unknown): ActionResult {
  return { ok: false, message: `操作失败: ${(e as Error).message}` };
}

// ============ User CRUD ============

/** 新增用户 */
export async function createUser(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const email = String(formData.get("email") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const role = String(formData.get("role") ?? "USER") as "USER" | "ADMIN";

    const user = await prisma.user.create({
      data: { email, name: name || null, role },
    });
    revalidatePath("/");
    return { ok: true, message: `✅ 新增用户成功: ${user.email}` };
  } catch (e) {
    return toResult(e);
  }
}

/** 编辑用户 */
export async function updateUser(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const id = String(formData.get("id") ?? "");
    const email = String(formData.get("email") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const role = String(formData.get("role") ?? "USER") as "USER" | "ADMIN";

    const user = await prisma.user.update({
      where: { id },
      data: { email, name: name || null, role },
    });
    revalidatePath("/");
    return { ok: true, message: `✅ 更新用户成功: ${user.email}` };
  } catch (e) {
    return toResult(e);
  }
}

/** 删除用户（onDelete: Cascade 级联删除其文章） */
export async function deleteUser(
  userId: string,
  _prev: ActionResult
): Promise<ActionResult> {
  try {
    const user = await prisma.user.delete({
      where: { id: userId },
      include: { _count: { select: { posts: true } } },
    });
    revalidatePath("/");
    return {
      ok: true,
      message: `🗑️ 用户已删除: ${user.email}（级联删除 ${user._count.posts} 篇文章）`,
    };
  } catch (e) {
    return toResult(e);
  }
}

// ============ Post CRUD ============

/** 新增文章 */
export async function createPost(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const title = String(formData.get("title") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();
    const authorId = String(formData.get("authorId") ?? "");
    const published = formData.get("published") === "on";

    const post = await prisma.post.create({
      data: { title, content: content || null, authorId, published },
      include: { author: true },
    });
    revalidatePath("/");
    return { ok: true, message: `✅ 新增文章成功: 《${post.title}》 by ${post.author.email}` };
  } catch (e) {
    return toResult(e);
  }
}

/** 编辑文章 */
export async function updatePost(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const id = Number(formData.get("id"));
    const title = String(formData.get("title") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();
    const authorId = String(formData.get("authorId") ?? "");
    const published = formData.get("published") === "on";

    const post = await prisma.post.update({
      where: { id },
      data: { title, content: content || null, authorId, published },
    });
    revalidatePath("/");
    return { ok: true, message: `✅ 更新文章成功: 《${post.title}》` };
  } catch (e) {
    return toResult(e);
  }
}

/** 删除文章 */
export async function deletePost(
  postId: number,
  _prev: ActionResult
): Promise<ActionResult> {
  try {
    await prisma.post.delete({ where: { id: postId } });
    revalidatePath("/");
    return { ok: true, message: `🗑️ 文章已删除 (id=${postId})` };
  } catch (e) {
    return toResult(e);
  }
}
