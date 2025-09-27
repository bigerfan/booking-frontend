import { useParams } from "react-router-dom";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";SS
// import faLocale from "@fullcalendar/core/locales/fa";
import { TimePickerSubmitDialog } from "@/components/calender/timepicker-submit-dialog";
import { useDialogStore } from "@/store/dialogStore";
import { socket } from "@/lib/socket";
import { useEffect, useState } from "react";
import { BookingCalendar } from "@/components/calender/customfullCalender";
import { isOverlapping } from "@/utils/dateController";
import { toast } from "sonner";

export default function TablePage() {
  const { id } = useParams<{ id: string }>();

  const setId = useDialogStore((state) => state.setTableId);

  const [sessions, setSessions] = useState<
    {
      id: number;
      title: string;
      started_time: string;
      end_time: string;
      session_description: string;
      invited_people: [];
    }[]
  >([]);

  // const start = new Date(sessions.sessionDate);
  // const end = new Date(start.getTime() + 60 * 60 * 1000); // add 1 hour

  // const [selectedDate, setSelectedDate] = useState<string | null>(null);
  // const [selectedTime, setSelectedTime] = useState<string | null>(null);
  // const [slots, setSlots] = useState<TimeSlot[]>([]);
  // const [open, setOpen] = useState(false);
  // const [startTime, setStartTime] = useState<string>("");
  // const [endTime, setEndTime] = useState<string>("");

  const { setOpen, setSelectedDate } = useDialogStore();

  const handleDateClick = (start: string, end: string) => {
    const formatedStartDate = new Date(start);
    const formatedEndDate = new Date(end);
    if (isOverlapping(formatedStartDate, formatedEndDate, sessions)) {
      toast.error("این بازه زمانی با یک جلسه موجود هم‌پوشانی دارد");
      return;
    }
    // console.log(formatedStartDate.toString());
    setSelectedDate({
      start: formatedStartDate.toString(),
      end: formatedEndDate.toString(),
    });
    setOpen(true);
  };

  // const handleSave = () => {
  //   if (selectedDate && startTime && endTime) {
  //     const start = `${selectedDate}T${startTime}`;
  //     const end = `${selectedDate}T${endTime}`;
  //     setSlots((prev) => [...prev, { start, end }]);
  //   }
  //   setOpen(false);
  //   setStartTime("");
  //   setEndTime("");
  // };

  useEffect(() => {
    setId(Number(id));
    // socket.connect();
    // socket.on("connect", () => {
    socket.emit("register-table", id);
    // console.log("connected to socket");
    // });
    socket.on("sessions", (tableSessions) => {
      // console.log(tableSessions);
      setSessions(tableSessions);
    });

    return () => {
      socket.emit("leave-table", id);
      // socket.disconnect(); // cleanup
    };
  }, [id, setId]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">رزرو میز {id}</h1>

      {/* <FullCalendar
        locale={faLocale}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        // events={slots.map((slot) => ({
        //   title: "رزرو",
        //   start: slot.start,
        //   end: slot.end,
        // }))}
      /> */}
      <BookingCalendar
        initialView="timeGridWeek"
        views="timeGridWeek,timeGridDay"
        onSelectTime={handleDateClick}
        sessions={sessions.map((session) => {
          const start = new Date(session.started_time);
          const end = new Date(session.end_time);
          // console.log("start :", start);
          // console.log("end :", end);
          return {
            description: session.session_description,
            start,
            end,
            id: session.id.toString(),
            sessionDate: undefined,
            title: session.title,
            extendedProps: {
              invitedPeople: session.invited_people,
              description: session.session_description,
            },
          };
        })}
      />
      <TimePickerSubmitDialog />
    </div>
  );
}
