interface User {
  id: number;
  name: string;
  nick: string;
  role: string | null;
  veduci: boolean;
}

interface PlannerEvent {
  id: number;
  nazov: string;
  ucebna: string;
  prihlasene_id: number | null;
  od: Date;
  do: Date;
  kamera: boolean;
  redaktor: boolean;
  foto: boolean;
  zvuk: boolean;
  reels: boolean;
  link: string | null;
  signups?: User[];
}

interface EventSignup {
  event_id: number;
  user_id: number;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: PlannerEvent[];
}

interface AuthResponse {
  token: string;
  user: User;
}

export type { User, PlannerEvent, EventSignup, CalendarDay, AuthResponse };