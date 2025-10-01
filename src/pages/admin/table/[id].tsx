import { BookingCalendar } from "@/components/calender/customfullCalender";
import { TimePickerSubmitDialog } from "@/components/calender/timepicker-submit-dialog";
import { Header } from "@/components/header/header";
import { useCalenderState } from "@/hooks/useCalenderState";
import { useParams } from "react-router-dom";

const AdminTableView = () => {
  const { id } = useParams<{ id: string }>();

  const { handleDateClick, sessions } = useCalenderState(id);

  return (
    <div className={`p-6 `}>
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
  );
};

export default AdminTableView;
