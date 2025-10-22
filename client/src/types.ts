export type User = {
  id: string;
  email: string;
  created_at?: string;
};

export type Habit = {
  id: string;
  name: string;
  description?: string;
  cadence: 'daily' | 'weekly' | 'monthly';
  target_count: number;
  archived: boolean;
  created_at: string;
};

export type HabitLog = {
  id: string;
  occurs_on: string; // YYYY-MM-DD
  count: number;
  note?: string | null;
  created_at: string;
};
