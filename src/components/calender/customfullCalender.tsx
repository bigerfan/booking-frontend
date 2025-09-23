import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // for selecting time slots
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css"; // import built-in scale animation
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
    // const color =
    //   eventInfo.event.extendedProps.type === "meeting"
    //     ? "bg-blue-500 text-white"
    //     : eventInfo.event.extendedProps.type === "lunch"
    //     ? "bg-green-500 text-white"
    //     : "bg-gray-800 text-white";

    return (
      <div
        className={`p-1 rounded bg-gray-500 text-white text-sm flex flex-col h-full`}
      >
        <span className="font-semibold">{eventInfo.event.title}</span>
        <span>{eventInfo.timeText}</span>
      </div>
    );
  };

  const createTooltipContent = (event: any) => {
    const container = document.createElement("div");
    container.className = "p-2 rounded-lg max-w-xs";

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
      />
    </div>
  );
};
