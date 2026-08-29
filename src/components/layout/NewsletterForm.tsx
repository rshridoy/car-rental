"use client";

import { useId, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterForm() {
  const id = useId();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();

    if (!EMAIL_PATTERN.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setError(null);
    e.currentTarget.reset();
    toast.success("Subscribed!", { description: `We'll send deals to ${email}.` });
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-1.5">
      <Label htmlFor={id} className="text-sm font-semibold text-foreground">
        Get rental deals in your inbox
      </Label>
      <div className="flex gap-2">
        <Input id={id} name="email" type="email" placeholder="you@example.com" aria-invalid={!!error} className="bg-card" />
        <Button type="submit" className="shrink-0 rounded-lg">
          Subscribe
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </form>
  );
}
