import { Dialog } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Habit, HabitLog } from "@/types";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  habit: Habit | null;
  logs: HabitLog[];
  onDelete: (logId: string) => Promise<void>;
};

export default function ViewLogsDialog({ open, onOpenChange, habit, logs, onDelete }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={`Logs${habit ? ` — ${habit.name}` : ""}`}>
      <div className="space-y-3">
        {logs.length === 0 && <p className="text-muted-foreground">No logs yet.</p>}
        {logs.map(l => (
          <div key={l.id} className="flex items-center gap-3">
            <div className="min-w-[7rem] text-sm">{l.occurs_on}</div>
            <div className="text-sm">× {l.count}</div>
            {l.note && <div className="text-sm text-muted-foreground">— {l.note}</div>}
            <div className="ml-auto">
              <Button variant="destructive" size="sm" onClick={() => onDelete(l.id)}>Delete</Button>
            </div>
          </div>
        ))}
        <Separator />
      </div>
    </Dialog>
  );
}
