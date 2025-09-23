import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // for selecting time slots
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css"; // import built-in scale animation
import type { EventApi } from "@fullcalendar/core";
// import { Button } from "@/components/ui/button";
import type {
  DateSelectArg,
  EventContentArg,
} from "@fullcalendar/core/index.js";
import faLocale from "@fullcalendar/core/locales/fa";

interface Session {
  id: string;
  description: string;
  start: string | Date; // ISO string
  end: string | Date; // ISO string
  //   type?: "meeting" | "lunch" | "other";
}

interface CalendarProps {
  sessions: Session[];
  onSelectTime: (start: string, end: string) => void;
}

export const BookingCalendar: React.FC<CalendarProps> = ({
  sessions,
  onSelectTime,
}) => {
  // Render custom event content
  const renderEventContent = (eventInfo: EventContentArg) => {
    const invitedPeople = eventInfo.event.extendedProps.invitedPeople || [];
    const color =
      !eventInfo.isPast && !eventInfo.isFuture
        ? "bg-red-600 text-white animate-pulse-slow"
        : eventInfo.isFuture
        ? "bg-gray-800 text-white"
        : "bg-gray-500 text-white";

    // تعیین حداکثر تعداد اسمی که نمایش داده می‌شود
    const maxVisible = 3;
    const visiblePeople = invitedPeople.slice(0, maxVisible);
    const hiddenCount = invitedPeople.length - visiblePeople.length;

    return (
      <div
        className={`p-1 px-2 rounded ${color} text-white text-md flex flex-col h-full`}
      >
        <span className="font-semibold">{eventInfo.event.title}</span>
        <span className="text-sm">{eventInfo.timeText}</span>

        {invitedPeople.length > 0 && (
          <ul className="mt-1 text-xs list-disc list-inside">
            {visiblePeople.map(
              (
                person: { fullName: string; phoneNumber: string },
                idx: number
              ) => (
                <li key={idx}>{person.fullName}</li>
              )
            )}
            {hiddenCount > 0 && <li>و {hiddenCount} نفر دیگر...</li>}
          </ul>
        )}
      </div>
    );
  };

  const createTooltipContent = (event: EventApi) => {
    const container = document.createElement("div");
    container.dir = "rtl";
    container.className = "p-2 rounded-lg max-w-xs z-40 ";

    const title = document.createElement("h3");
    title.className = "font-semibold text-white mb-1";
    title.textContent = event.title;

    const description = document.createElement("p");
    description.className = "text-gray-50 text-sm mb-1";
    description.textContent = event.extendedProps.description;

    const invited = document.createElement("div");
    invited.className = "text-gray-100 text-sm";
    invited.textContent =
      "دعوت‌شدگان: " +
      event.extendedProps.invitedPeople
        .map((p: { fullName: string }) => p.fullName)
        .join(", ");

    container.appendChild(title);
    container.appendChild(description);
    container.appendChild(invited);

    return container;
  };

  // Handle selecting a time slot
  const handleSelect = (selectInfo: DateSelectArg) => {
    const start = selectInfo.start.toISOString();
    const end = selectInfo.end.toISOString();
    onSelectTime(start, end);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        locale={faLocale}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        eventDidMount={(info) => {
          const tooltipContent = createTooltipContent(info.event);

          tippy(info.el, {
            content: tooltipContent,
            allowHTML: true,
            interactive: true,
            placement: "top",
            animation: "fade", // can change to scale, shift-away, etc.
            duration: [300, 200],
            arrow: true,
            theme: "light-border",
            inertia: true,
            appendTo: document.body,
          });
        }}
        selectable={true}
        select={handleSelect}
        events={sessions}
        eventContent={renderEventContent}
        nowIndicator={true}
        allDaySlot={false}
        height="auto"
        slotMinTime="08:00:00"
        slotMaxTime="22:00:00"
        slotLabelFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
        selectLongPressDelay={300} // میلی‌ثانیه
        eventLongPressDelay={300}
      />
    </div>
  );
};
