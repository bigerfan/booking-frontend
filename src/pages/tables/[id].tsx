import { useParams } from "react-router-dom";
import { TimePickerSubmitDialog } from "@/components/calender/timepicker-submit-dialog";
import { useDialogStore } from "@/store/dialogStore";
import { socket } from "@/lib/socket";
import { useEffect, useState } from "react";
import { BookingCalendar } from "@/components/calender/customfullCalender";
import { isOverlapping } from "@/utils/dateController";
import { toast } from "sonner";
import { Banner } from "@/components/banner/banner";
import { useBannerStore } from "@/store/bannerStore";
import { useGetCurrentSession } from "@/hooks/useGetCurrentSession";
import dayjs from "../../utils/dayjs";
import { Header } from "@/components/header/header";

export default function TablePage() {
  const { id } = useParams<{ id: string }>();

  const setId = useDialogStore((state) => state.setTableId);

  const [sessions, setSessions] = useState<
    {
      id: number | string;
      title: string;
      started_time: string;
      end_time: string;
      session_description: string;
      invited_people: { fullName: string }[];
    }[]
  >([]);

  const { setOpen, setSelectedDate } = useDialogStore();
  const {
    currentSession,
    setCurrentSession,
    // setShowBannerCountDown,
    showBanner,
    setShowBanner,
    resetBannerCountDown,
  } = useBannerStore();

  const handleDateClick = (start: string, end: string) => {
    const formatedStartDate = new Date(start);
    const formatedEndDate = new Date(end);
    // console.log(formatedEndDate);
    // console.log(formatedStartDate);
    if (isOverlapping(formatedStartDate, formatedEndDate, sessions)) {
      toast.error("این بازه زمانی با یک جلسه موجود هم‌پوشانی دارد");
      return;
    }
    // console.log(formatedStartDate.toString());
    setSelectedDate({
      start: formatedStartDate.toString(),
      end: formatedEndDate.toString(),
    });

    // console.log(formatedEndDate.toString());
    // console.log(formatedStartDate.toString());
    setOpen(true);
  };

  useEffect(() => {
    const reset = () => resetBannerCountDown(10000);

    window.addEventListener("mousemove", reset);
    window.addEventListener("keydown", reset);
    window.addEventListener("click", reset);
    window.addEventListener("touchstart", reset);

    reset();

    return () => {
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("keydown", reset);
      window.removeEventListener("click", reset);
      window.removeEventListener("touchstart", reset);
    };
  }, [resetBannerCountDown]);

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
      // setCurrentSession(null);
    });

    return () => {
      socket.emit("leave-table", id);
      // socket.disconnect(); // cleanup
    };
  }, [id, setId]);

  const startedSession = useGetCurrentSession(sessions);

  useEffect(() => {
    if (!startedSession) {
      setCurrentSession(null);
      return;
    }
    const startedHour = dayjs(startedSession?.started_time)
      .calendar("jalali")
      .locale("fa")
      .format("HH:mm");

    const endHour = dayjs(startedSession?.end_time)
      .calendar("jalali")
      .locale("fa")
      .format("HH:mm");

    setCurrentSession(`${startedHour} - ${endHour}`);
  }, [startedSession, setCurrentSession]);

  return (
    <>
      {currentSession && showBanner && (
        <Banner sessionTime={currentSession} setShowBanner={setShowBanner} />
      )}
      <div
        className={`p-6 ${showBanner && currentSession ? "hidden" : "block"}`}
      >
        {/* <div className="flex justify-between ">
          <h1 className="text-xl font-bold mb-4">رزرو میز {id}</h1>
          <FullscreenButton />
        </div> */}
        <Header pageTitle={`رزرو میز ${id}`} />

        <BookingCalendar
          initialView="timeGridWeek"
          views="timeGridWeek,timeGridDay"
          onSelectTime={handleDateClick}
          sessions={sessions.map((session) => {
            const start = new Date(session.started_time);
            const end = new Date(session.end_time);

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
    </>
  );
}
