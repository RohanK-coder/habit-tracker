import React, { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

type Toast = { id: number; title?: string; description?: string; variant?: "default"|"destructive" };
type ToastContextValue = { toast: (t: Omit<Toast, "id">) => void };
const ToastCtx = createContext<ToastContextValue | undefined>(undefined);

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  function toast(t: Omit<Toast, "id">) {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, ...t }]);
    setTimeout(() => setToasts((prev) => prev.filter(x => x.id != id)), 3000);
  }
  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className={cn("rounded-md border p-3 shadow bg-card", t.variant==="destructive" && "border-destructive text-destructive")}>
            {t.title && <div className="font-medium">{t.title}</div>}
            {t.description && <div className="text-sm text-muted-foreground">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside ToasterProvider");
  return ctx;
}
