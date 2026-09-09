"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { createPost, updatePost, type ActionResult } from "@/app/lib/actions";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState: ActionResult = { ok: false, message: "" };

export type PostFormData = {
  id: number;
  title: string;
  content: string | null;
  published: boolean;
  authorId: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post?: PostFormData | null;
  authors: { id: string; email: string }[];
  onSuccess: () => void;
};

export default function PostForm({ open, onOpenChange, post, authors, onSuccess }: Props) {
  const isEdit = !!post;
  const [authorId, setAuthorId] = useState(post?.authorId ?? "");
  const [published, setPublished] = useState(post?.published ?? false);
  const action = isEdit ? updatePost : createPost;
  const [state, formAction, pending] = useActionState(action, initialState);
  const prevStateRef = useRef<ActionResult>(initialState);

  useEffect(() => {
    if (state.ok && state.message !== prevStateRef.current.message) {
      prevStateRef.current = state;
      onSuccess();
    } else {
      prevStateRef.current = state;
    }
  }, [state, onSuccess]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "编辑文章" : "新增文章"}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="grid gap-4">
          {isEdit && <input type="hidden" name="id" value={post!.id} />}
          <div className="grid gap-2">
            <Label htmlFor="title">标题</Label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={post?.title ?? ""}
              placeholder="文章标题"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">内容</Label>
            <textarea
              id="content"
              name="content"
              rows={4}
              defaultValue={post?.content ?? ""}
              placeholder="可选"
              className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>
          <div className="grid gap-2">
            <Label>作者</Label>
            <input type="hidden" name="authorId" value={authorId} />
            <Select value={authorId} onValueChange={(v) => v && setAuthorId(v)} required>
              <SelectTrigger>
                <SelectValue>
                  {(value) => authors.find((a) => a.id === value)?.email ?? "选择作者"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {authors.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={published}
              onCheckedChange={(v) => setPublished(v === true)}
              name="published"
            />
            已发布
          </label>
          <p className="min-h-5 text-sm text-muted-foreground">{state.message}</p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "提交中..." : "保存"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
