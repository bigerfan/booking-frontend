import { useBannerStore } from "@/store/bannerStore";
import type { EventContentArg } from "@fullcalendar/core/index.js";
import { useEffect, useRef, useState } from "react";

export const EventItem = ({ eventInfo }: { eventInfo: EventContentArg }) => {
  const { view, event } = eventInfo;
  const invitedPeople = eventInfo?.event?.extendedProps?.invitedPeople || [];
  // const setCurrentSession = useBannerStore((state) => state.setCurrentSession);
  const currentSession = useBannerStore((state) => state.currentSession);

  const [isCurrentSession, setIsCurrentSession] = useState<boolean>(false);

  // const isCurrentSession =
  //   !eventInfo?.isPast && !eventInfo?.isFuture ? eventInfo.timeText : false;

  const color = isCurrentSession
    ? "bg-red-600 text-white animate-pulse-slow"
    : eventInfo.isFuture
    ? "bg-gray-800 text-white"
    : "bg-gray-500 text-white";

  const containerRef = useRef<HTMLDivElement>(null);
  const [maxVisible, setMaxVisible] = useState(invitedPeople.length);

  useEffect(() => {
    if (containerRef?.current) {
      const containerHeight = containerRef.current.clientHeight;
      const lineHeight = 18;
      const availableLines = Math.floor(containerHeight / lineHeight) - 3;
      setMaxVisible(Math.max(0, availableLines));
    }
    // if (isCurrentSession) setCurrentSession(eventInfo.timeText);
  }, [invitedPeople?.length]);

  useEffect(() => {
    setIsCurrentSession(
      currentSession && !eventInfo?.isPast && !eventInfo?.isFuture
        ? true
        : false
    );
  }, [currentSession, setIsCurrentSession]);

  const visiblePeople = invitedPeople?.slice(0, maxVisible);
  const hiddenCount = invitedPeople?.length - visiblePeople?.length;

  const start = event.start
    ? event.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";
  const end = event.end
    ? event.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";
  return (
    <>
      {(view.type == "timeGridWeek" || view.type == "timeGridDay") && (
        <div
          ref={containerRef}
          className={`py-[2px] px-2 rounded ${color} text-white text-md flex flex-col h-full overflow-hidden`}
        >
          <span className="font-semibold">{event.title}</span>
          <span className="text-sm">{eventInfo?.timeText}</span>

          {invitedPeople.length > 0 && (
            <ul className="mt-1 text-xs list-disc list-inside">
              {visiblePeople.map(
                (
                  person: { fullName: string; phoneNumber: string },
                  idx: number
                ) => (
                  <li key={idx}>{person?.fullName}</li>
                )
              )}
              {hiddenCount > 0 && <li>و {hiddenCount} نفر دیگر...</li>}
            </ul>
          )}
        </div>
      )}
      {view.type === "dayGridMonth" && (
        <div className={`text-xs p-1 rounded ${color} text-white w-full`}>
          <div className="font-semibold truncate">{event.title}</div>
          <div dir="ltr">
            {start}
            {end ? ` - ${end}` : ""}
          </div>
        </div>
      )}
    </>
  );
};
