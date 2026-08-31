"use client";

import { useId, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { ADMIN_USERS, type AdminUser } from "@/data/admin";
import { cn } from "@/lib/utils";

const ROLES: AdminUser["role"][] = ["Owner", "Manager", "Support", "Finance"];

export default function SuperAdminPage() {
  const id = useId();
  const [users, setUsers] = useState(ADMIN_USERS);
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const role = String(form.get("role") ?? "Support") as AdminUser["role"];

    if (!name || !email) {
      toast.error("Name and email are required");
      return;
    }

    setUsers((prev) => [{ id: String(prev.length + 1), name, email, role, status: "invited" }, ...prev]);
    setOpen(false);
    e.currentTarget.reset();
    toast.success(`Invited ${name} as ${role}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Super Admin"
        description="Manage who has admin access to this dashboard."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-lg">
                <Plus className="h-4 w-4" />
                Invite Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite admin</DialogTitle>
              </DialogHeader>
              <form id={id} onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`${id}-name`}>Name</Label>
                  <Input id={`${id}-name`} name="name" placeholder="Jane Doe" required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`${id}-email`}>Email</Label>
                  <Input id={`${id}-email`} name="email" type="email" placeholder="jane@bestauto.com" required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`${id}-role`}>Role</Label>
                  <Select name="role" defaultValue="Support">
                    <SelectTrigger id={`${id}-role`} className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </form>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" form={id}>
                  Send invite
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <DataTable
        data={users}
        rowKey={(row) => row.id}
        searchKeys={(row) => `${row.name} ${row.email}`}
        searchPlaceholder="Search admins"
        columns={[
          { key: "name", header: "Name", sortValue: (row) => row.name },
          { key: "email", header: "Email" },
          { key: "role", header: "Role", sortValue: (row) => row.role },
          {
            key: "status",
            header: "Status",
            render: (row) => (
              <Badge
                className={cn(
                  "border-transparent",
                  row.status === "active" ? "bg-success/10 text-success" : "bg-info/10 text-info"
                )}
              >
                {row.status}
              </Badge>
            ),
          },
        ]}
      />
    </div>
  );
}
