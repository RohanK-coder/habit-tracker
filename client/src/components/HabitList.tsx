import { Habit } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ClipboardList } from "lucide-react";

type Props = {
  habits: Habit[];
  onAddLog: (habit: Habit) => void;
  onViewLogs: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
};

export default function HabitList({ habits, onAddLog, onViewLogs, onDelete }: Props) {
  if (habits.length === 0) {
    return <p className="text-muted-foreground">No habits yet—create one to get started.</p>;
  }
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {habits.map(h => (
        <Card key={h.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{h.name}</span>
              <span className="text-xs font-normal text-muted-foreground uppercase">{h.cadence}</span>
            </CardTitle>
            {h.description && <CardDescription>{h.description}</CardDescription>}
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Button size="sm" onClick={() => onAddLog(h)}><Plus className="mr-2 h-4 w-4" /> Add Log</Button>
            <Button size="sm" variant="secondary" onClick={() => onViewLogs(h)}><ClipboardList className="mr-2 h-4 w-4" /> View Logs</Button>
            <div className="ml-auto">
              <Button size="sm" variant="destructive" onClick={() => onDelete(h)}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
