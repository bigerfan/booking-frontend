import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // for selecting time slots
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css"; // import built-in scale animation
import type { EventApi, EventContentArg } from "@fullcalendar/core";
// import { Button } from "@/components/ui/button";
import type { DateSelectArg } from "@fullcalendar/core/index.js";
import faLocale from "@fullcalendar/core/locales/fa";
import { EventItem } from "./eventContent";

interface Session {
  id: string;
  description: string;
  start: string | Date; // ISO string
  end: string | Date; // ISO string
  //   type?: "meeting" | "lunch" | "other";
}

interface CalendarProps {
  initialView: string;
  views: string;
  sessions: Session[];
  onSelectTime: (start: string, end: string) => void;
}

// views: dayGridMonth
// ,timeGridWeek
// ,timeGridDay

export const BookingCalendar: React.FC<CalendarProps> = ({
  initialView,
  views,
  sessions,
  onSelectTime,
}) => {
  const renderEventContent = (eventInfo: EventContentArg) => (
    <EventItem eventInfo={eventInfo} />
  );

  const createTooltipContent = (event: EventApi) => {
    // const container = document.createElement("div");
    // container.dir = "rtl";
    // container.className = "p-2 rounded-lg max-w-xs  ";

    // const title = document.createElement("h3");
    // title.className = "font-semibold text-white mb-1";
    // title.textContent = event.title;

    // const description = document.createElement("p");
    // description.className = "text-gray-50 text-sm mb-1";
    // description.textContent = event.extendedProps.description;

    // const invited = document.createElement("div");
    // invited.className = "text-gray-100 text-sm";
    // invited.textContent =
    //   "دعوت‌شدگان: " +
    //   event.extendedProps.invitedPeople
    //     .map((p: { fullName: string }) => p.fullName)
    //     .join(", ");

    // container.appendChild(title);
    // container.appendChild(description);
    // container.appendChild(invited);

    // return container;
    const invitedNames = event.extendedProps.invitedPeople
      .map((p: { fullName: string }) => p.fullName)
      .join(", ");
    const startTime = new Date(event.start!).toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const endTime = new Date(event.end!).toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `
    <div dir="rtl" class="p-3 rounded-xl shadow-lg max-w-sm bg-neutral-700 text-gray-100">
      <h3 class="font-bold text-lg text-white mb-1 truncate">${event.title}</h3>
      <div class="text-gray-200 text-sm mb-2">
         ${startTime} - ${endTime}
      </div>
      <p class="text-gray-200 text-sm mb-2 break-words">${
        event.extendedProps.description || "-"
      }</p>
      <div class="text-gray-300 text-sm">
        <span class="font-semibold">دعوت‌شدگان:</span> ${invitedNames || "-"}
      </div>
    </div>
  `;
  };

  // Handle selecting a time slot
  const handleSelect = (selectInfo: DateSelectArg) => {
    // console.log(selectInfo);
    if (selectInfo.view.type === "dayGridMonth") return;
    const start = selectInfo.start.toISOString();
    const end = selectInfo.end.toISOString();
    // console.log(start);
    // console.log(end);
    onSelectTime(start, end);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        locale={faLocale}
        initialView={initialView || "timeGridWeek"}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: views,
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
            trigger: "mouseenter focus click",
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
        selectLongPressDelay={300}
        eventLongPressDelay={300}
      />
    </div>
  );
};
