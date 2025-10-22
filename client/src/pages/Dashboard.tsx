import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import HabitList from "@/components/HabitList";
import CreateHabitDialog from "@/components/CreateHabitDialog";
import AddLogDialog from "@/components/AddLogDialog";
import ViewLogsDialog from "@/components/ViewLogsDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Habit, HabitLog } from "@/types";
import { useToast } from "@/components/ui/toast";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [activeHabit, setActiveHabit] = useState<Habit | null>(null);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const { toast } = useToast();

  async function fetchHabits() {
    const { data } = await api.get<Habit[]>("/api/habits");
    setHabits(data.filter(h => !h.archived));
  }

  useEffect(() => { fetchHabits(); }, []);

  async function createHabit(payload: { name: string; description?: string; cadence: 'daily'|'weekly'|'monthly'; target_count: number }) {
    await api.post("/api/habits", payload);
    toast({ title: "Habit created" });
    await fetchHabits();
  }

  async function deleteHabit(h: Habit) {
    if (!confirm(`Delete "${h.name}"? This also deletes its logs.`)) return;
    await api.delete(`/api/habits/${h.id}`);
    toast({ title: "Habit deleted" });
    await fetchHabits();
  }

  async function openAddLog(h: Habit) {
    setActiveHabit(h);
    setLogOpen(true);
  }

  async function openViewLogs(h: Habit) {
    setActiveHabit(h);
    const { data } = await api.get<HabitLog[]>(`/api/habits/${h.id}/logs`);
    setLogs(data);
    setViewOpen(true);
  }

  async function addLog(payload: { occurs_on: string; count: number; note?: string }) {
    if (!activeHabit) return;
    await api.post(`/api/habits/${activeHabit.id}/logs`, payload);
    toast({ title: "Log added" });
    setLogOpen(false);
  }

  async function deleteLog(logId: string) {
    if (!activeHabit) return;
    await api.delete(`/api/habits/${activeHabit.id}/logs/${logId}`);
    toast({ title: "Log deleted" });
    setLogs((prev) => prev.filter(l => l.id !== logId));
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        <Card>
          <CardContent className="py-4 flex items-center justify-between">
            <div className="text-lg font-semibold">Your Habits</div>
            <Button onClick={() => setCreateOpen(true)}><Plus className="mr-2 h-4 w-4" /> New Habit</Button>
          </CardContent>
        </Card>

        <HabitList
          habits={habits}
          onAddLog={openAddLog}
          onViewLogs={openViewLogs}
          onDelete={deleteHabit}
        />

        <CreateHabitDialog open={createOpen} onOpenChange={setCreateOpen} onCreate={createHabit} />

        <AddLogDialog open={logOpen} onOpenChange={setLogOpen} habit={activeHabit} onAdd={addLog} />
        <ViewLogsDialog open={viewOpen} onOpenChange={setViewOpen} habit={activeHabit} logs={logs} onDelete={deleteLog} />
      </main>
    </div>
  );
}
