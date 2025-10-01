import { useBannerStore } from "@/store/bannerStore";
import { useDialogStore } from "@/store/dialogStore";
import { isOverlapping } from "@/utils/dateController";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import dayjs from "../utils/dayjs";
import { useGetCurrentSession } from "./useGetCurrentSession";
import { socket } from "@/lib/socket";

export const useCalenderState = (id: string = "0") => {
  const [sessions, setSessions] = useState<
    {
      id: number;
      title: string;
      started_time: string;
      end_time: string;
      session_description: string;
      invited_people: { fullName: string }[];
    }[]
  >([]);

  const { setOpen, setSelectedDate, setTableId: setId } = useDialogStore();

  const {
    // currentSession,
    setCurrentSession,
    // setShowBannerCountDown,
    // showBanner,
    // setShowBanner,
    // resetBannerCountDown,
  } = useBannerStore();

  const startedSession = useGetCurrentSession(sessions);

  useEffect(() => {
    setId(id);
    // socket.connect();
    // socket.on("connect", () => {
    socket.emit("register-table", id);
    // console.log("connected to socket");
    // });
    socket.on("sessions", (tableSessions) => {
      // console.log(tableSessions);
      setSessions(tableSessions);
      //   console.log(tableSessions[1].id);
      // setCurrentSession(null);
    });

    return () => {
      socket.emit("leave-table", id);
      // socket.disconnect(); // cleanup
    };
  }, [id, setId]);

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

  return { handleDateClick, sessions, setSessions };
};
