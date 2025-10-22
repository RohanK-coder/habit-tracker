import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

type DialogProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function Dialog({ open, onOpenChange, title, description, children, footer }: DialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className={cn("relative z-50 w-full max-w-lg rounded-lg border bg-card p-6 shadow-lg")}>
        {title && <h3 className="text-xl font-semibold">{title}</h3>}
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        <div className="mt-4">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export function DialogTrigger({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  return <Button onClick={onClick}>{children}</Button>;
}
