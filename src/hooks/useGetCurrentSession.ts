import { useEffect, useState } from "react";

export type Session = {
  id: number | string;
  title: string;
  started_time: string;
  end_time: string;
  description?: string;
  invited_people?: { fullName: string }[];
};

export function useGetCurrentSession(sessions: Session[], intervalMs = 1000) {
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  useEffect(() => {
    const checkCurrentSession = () => {
      const now = new Date();
      const active = sessions.find(
        (s) => now >= new Date(s.started_time) && now <= new Date(s.end_time)
      );
      setCurrentSession(active || null);
    };

    checkCurrentSession();
    const interval = setInterval(checkCurrentSession, intervalMs);

    return () => clearInterval(interval);
  }, [sessions, intervalMs]);

  return currentSession;
}
