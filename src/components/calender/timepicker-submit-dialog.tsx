import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

import { InviteSessionForm } from "./dialog/invite-session-form";
import { useDialogStore } from "@/store/dialogStore";
import dayjs from "../../utils/dayjs";

// type dialogProps = {
//   open: boolean;
//   setOpen: (state: boolean) => void;
//   selectedDate: string | null;
// };

export const TimePickerSubmitDialog = () =>
  // {
  // open,
  //   setOpen,
  //   selectedDate,
  // }: dialogProps
  {
    // const [selectedTime, setSelectedTime] = useState<string | null>("");
    // const [step, setStep] = useState<number>(1);

    // const mock_times = ["11:00", "12:00", "1:00", "2:00"];

    const {
      // step,
      resetDialog,
      open,
      setOpen,
      selectedDate,
      // setSelectedTime,
      // selectedTime,
      // nextStep,
    } = useDialogStore();

    const persianDate = dayjs(selectedDate?.start)
      .calendar("jalali")
      .locale("fa")
      .format("YYYY/MM/DD");

    const startedHour = dayjs(selectedDate?.start)
      .calendar("jalali")
      .locale("fa")
      .format("HH:mm");

    const endHour = dayjs(selectedDate?.end)
      .calendar("jalali")
      .locale("fa")
      .format("HH:mm");

    useEffect(() => {
      if (!open) resetDialog();
    }, [open, resetDialog]);

    // const renderFirstStep = (
    //   <>
    //     <div className="grid gap-4 py-4 " dir="rtl">
    //       <TimePicker
    //         value={selectedTime}
    //         onChange={setSelectedTime}
    //         interval={30}
    //         // disabledTimes={mock_times}
    //       />
    //     </div>
    //     <div className="flex justify-end gap-2" dir="rtl">
    //       <Button variant="outline" onClick={() => setOpen(false)}>
    //         انصراف
    //       </Button>
    //       <Button
    //         // disabled={!selectedTime || selectedTime.length < 1}
    //         onClick={nextStep}
    //       >
    //         انتخاب
    //       </Button>
    //     </div>
    //   </>
    // );

    // const renderSecondStep = (

    // );
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              تنظیم جلسه برای {persianDate} در ساعت {startedHour}-{endHour}
            </DialogTitle>
          </DialogHeader>
          {/* {step === 1 && renderFirstStep} */}
          {/* {step === 2 &&  */}
          <InviteSessionForm />
          {/* // } */}
        </DialogContent>
      </Dialog>
    );
  };
