"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteUser } from "@/app/lib/actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import UserForm, { type UserFormData } from "./user-form";

export type UserRow = UserFormData & { createdAt: string };

export default function UsersTable({ users }: { users: UserRow[] }) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<UserFormData | null>(null);
  const [isPending, startTransition] = useTransition();

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (user: UserRow) => {
    setEditing({ id: user.id, email: user.email, name: user.name, role: user.role });
    setFormOpen(true);
  };

  const onDelete = (user: UserRow) => {
    if (!window.confirm(`确认删除用户 ${user.email}？其文章会级联删除。`)) return;
    startTransition(async () => {
      await deleteUser(user.id, { ok: true, message: "" });
      router.refresh();
    });
  };

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-lg font-semibold">用户</h2>
        <Button size="sm" onClick={openCreate}>
          <Plus data-slot="icon" />
          新增
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">ID</TableHead>
            <TableHead>邮箱</TableHead>
            <TableHead>名字</TableHead>
            <TableHead>角色</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead className="w-28 text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                暂无数据
              </TableCell>
            </TableRow>
          )}
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-mono text-xs">{user.id.slice(0, 8)}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.name ?? "-"}</TableCell>
              <TableCell>
                <span
                  className={
                    user.role === "ADMIN"
                      ? "text-xs font-medium text-amber-600"
                      : "text-xs text-muted-foreground"
                  }
                >
                  {user.role}
                </span>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(user.createdAt).toLocaleString("zh-CN")}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon-sm" onClick={() => openEdit(user)}>
                  <Pencil data-slot="icon" />
                  <span className="sr-only">编辑</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  disabled={isPending}
                  onClick={() => onDelete(user)}
                >
                  <Trash2 data-slot="icon" className="text-destructive" />
                  <span className="sr-only">删除</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <UserForm
        key={`${formOpen}-${editing?.id ?? "create"}`}
        open={formOpen}
        onOpenChange={setFormOpen}
        user={editing}
        onSuccess={() => {
          setFormOpen(false);
          router.refresh();
        }}
      />
    </div>
  );
}
