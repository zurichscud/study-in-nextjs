"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deletePost } from "@/app/lib/actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import PostForm, { type PostFormData } from "./post-form";

export type PostRow = PostFormData & { createdAt: string; authorEmail: string };

export default function PostsTable({
  posts,
  authors,
}: {
  posts: PostRow[];
  authors: { id: string; email: string }[];
}) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PostFormData | null>(null);
  const [isPending, startTransition] = useTransition();

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (post: PostRow) => {
    setEditing({
      id: post.id,
      title: post.title,
      content: post.content,
      published: post.published,
      authorId: post.authorId,
    });
    setFormOpen(true);
  };

  const onDelete = (post: PostRow) => {
    if (!window.confirm(`确认删除文章《${post.title}》？`)) return;
    startTransition(async () => {
      await deletePost(post.id, { ok: true, message: "" });
      router.refresh();
    });
  };

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-lg font-semibold">文章</h2>
        <Button size="sm" onClick={openCreate}>
          <Plus data-slot="icon" />
          新增
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">ID</TableHead>
            <TableHead>标题</TableHead>
            <TableHead>作者</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead className="w-28 text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                暂无数据
              </TableCell>
            </TableRow>
          )}
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-mono text-xs">#{post.id}</TableCell>
              <TableCell className="max-w-64 truncate font-medium">{post.title}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{post.authorEmail}</TableCell>
              <TableCell>
                <Badge variant={post.published ? "default" : "secondary"}>
                  {post.published ? "已发布" : "草稿"}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(post.createdAt).toLocaleString("zh-CN")}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon-sm" onClick={() => openEdit(post)}>
                  <Pencil data-slot="icon" />
                  <span className="sr-only">编辑</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={isPending}
                  onClick={() => onDelete(post)}
                >
                  <Trash2 data-slot="icon" className="text-destructive" />
                  <span className="sr-only">删除</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PostForm
        key={`${formOpen}-${editing?.id ?? "create"}`}
        open={formOpen}
        onOpenChange={setFormOpen}
        post={editing}
        authors={authors}
        onSuccess={() => {
          setFormOpen(false);
          router.refresh();
        }}
      />
    </div>
  );
}
