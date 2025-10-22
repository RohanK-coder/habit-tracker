import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { todayISO } from "@/lib/utils";
import { Habit } from "@/types";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  habit: Habit | null;
  onAdd: (data: { occurs_on: string; count: number; note?: string }) => Promise<void>;
};

export default function AddLogDialog({ open, onOpenChange, habit, onAdd }: Props) {
  const [occursOn, setOccursOn] = useState(todayISO());
  const [count, setCount] = useState(1);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!habit) return;
    setLoading(true);
    try {
      await onAdd({ occurs_on: occursOn, count, note });
      onOpenChange(false);
      setOccursOn(todayISO()); setCount(1); setNote("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={`Add Log${habit ? ` — ${habit.name}` : ""}`}>
      <form className="space-y-4" onSubmit={submit}>
        <div className="space-y-1">
          <Label>Date</Label>
          <Input type="date" value={occursOn} onChange={e => setOccursOn(e.target.value)} required />
        </div>
        <div className="space-y-1">
          <Label>Count</Label>
          <Input type="number" min={1} max={100} value={count} onChange={e => setCount(parseInt(e.target.value || "1"))} required />
        </div>
        <div className="space-y-1">
          <Label>Note</Label>
          <Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Optional" />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
        </div>
      </form>
    </Dialog>
  );
}
