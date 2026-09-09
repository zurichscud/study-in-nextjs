"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { createUser, updateUser, type ActionResult } from "@/app/lib/actions";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState: ActionResult = { ok: false, message: "" };

export type UserFormData = {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "ADMIN";
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: UserFormData | null;
  onSuccess: () => void;
};

export default function UserForm({ open, onOpenChange, user, onSuccess }: Props) {
  const isEdit = !!user;
  const [role, setRole] = useState<"USER" | "ADMIN">(user?.role ?? "USER");
  const action = isEdit ? updateUser : createUser;
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
          <DialogTitle>{isEdit ? "编辑用户" : "新增用户"}</DialogTitle>
        </DialogHeader>
        <form
          action={formAction}
          className="grid gap-4"
          onSubmit={() => {
            prevStateRef.current = initialState;
          }}
        >
          {isEdit && <input type="hidden" name="id" value={user!.id} />}
          <div className="grid gap-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={user?.email ?? ""}
              placeholder="name@example.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">名字</Label>
            <Input
              id="name"
              name="name"
              defaultValue={user?.name ?? ""}
              placeholder="可选"
            />
          </div>
          <div className="grid gap-2">
            <Label>角色</Label>
            <input type="hidden" name="role" value={role} />
            <Select value={role} onValueChange={(v) => setRole(v as "USER" | "ADMIN")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">USER</SelectItem>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
