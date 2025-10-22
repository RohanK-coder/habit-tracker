import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (habit: { name: string; description?: string; cadence: 'daily'|'weekly'|'monthly'; target_count: number }) => Promise<void>;
};

export default function CreateHabitDialog({ open, onOpenChange, onCreate }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cadence, setCadence] = useState<'daily'|'weekly'|'monthly'>('daily');
  const [target, setTarget] = useState(1);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onCreate({ name, description, cadence, target_count: target });
      onOpenChange(false);
      setName(""); setDescription(""); setCadence('daily'); setTarget(1);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Create Habit" description="Define a new habit to track.">
      <form className="space-y-4" onSubmit={submit}>
        <div className="space-y-1">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-1">
          <Label>Description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Cadence</Label>
            <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={cadence} onChange={e => setCadence(e.target.value as any)}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="space-y-1">
            <Label>Target Count</Label>
            <Input type="number" min={1} max={100} value={target} onChange={e => setTarget(parseInt(e.target.value || "1"))} />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create"}</Button>
        </div>
      </form>
    </Dialog>
  );
}
