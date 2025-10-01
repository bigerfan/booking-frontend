import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // for selecting time slots
import tippy from "tippy.js";
import type { Instance as TippyInstance } from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css"; // import built-in scale animation
import type { EventApi, EventContentArg } from "@fullcalendar/core";
// import { Button } from "@/components/ui/button";
import type { DateSelectArg } from "@fullcalendar/core/index.js";
import faLocale from "@fullcalendar/core/locales/fa";
import { EventItem } from "./eventContent";
import "./calender.css";
import { useLocation } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Button } from "../ui/button";
import { DeleteSession } from "@/lib/actions";
import { socket } from "@/lib/socket";
import { useDialogStore } from "@/store/dialogStore";

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

  const tableId = useDialogStore((state) => state.tableId);

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const location = useLocation();

  useEffect(() => {
    setIsAdmin(location.pathname.startsWith("/admin"));
  }, []);

  const TooltipContent = ({
    event,
    isAdmin,
    instance,
  }: {
    event: EventApi;
    isAdmin: boolean;
    instance: TippyInstance;
  }) => {
    // const deleteProduct = () => {
    //   alert("deleted");
    // };

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

    // console.log(event.id);

    return (
      <div
        dir="rtl"
        className={`p-3 rounded-xl shadow-lg max-w-sm bg-neutral-700 text-gray-100`}
      >
        <h3 className="font-bold text-lg text-white mb-1 truncate">
          {event.title}
        </h3>
        <div className="text-gray-200 text-sm mb-2">
          {startTime} - {endTime}
        </div>
        <p className="text-gray-200 text-sm mb-2 break-words">
          {event.extendedProps.description || "-"}
        </p>
        <div className="text-gray-300 text-sm">
          <span className="font-semibold">دعوت‌شدگان:</span>{" "}
          {invitedNames || "-"}
        </div>
        {isAdmin && (
          <div className="w-fit mx-auto my-2">
            <Button
              variant="destructive"
              onClick={async () => {
                const res = await DeleteSession(event.id);
                if (res?.status == 200) {
                  instance.destroy();
                  socket.emit("update-session", tableId);
                }
              }}
              // className="bg-red-400 py-1 px-2 rounded-sm hover:bg-red-500 hover:ring-1 hover:ring-red-300 transition-all"
            >
              حذف جلسه
            </Button>
          </div>
        )}
      </div>
    );
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
          const container = document.createElement("div");
          const root = createRoot(container);

          const instance = tippy(info.el, {
            content: container,
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
          root.render(
            <TooltipContent
              event={info.event}
              isAdmin={isAdmin}
              instance={instance}
            />
          );
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
