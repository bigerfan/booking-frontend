// src/types/reservation.ts
export type TimeSlot = {
  start: string; // ISO string (e.g. "2025-09-20T14:00")
  end: string; // ISO string
};

export type session = {
  id?: number;
  title: string;
  invited_people: { fullName: string; phoneNumber: string }[];
  session_description: string;
  started_time: string;
  end_time: string;
  table_id: string;
};
