export const isOverlapping = (
  newStart: Date,
  newEnd: Date,
  sessions: { started_time: string; end_time: string }[]
) => {
  return sessions.some((session) => {
    const start = new Date(session.started_time);
    const end = new Date(session.end_time);
    return newStart < end && newEnd > start;
  });
};
