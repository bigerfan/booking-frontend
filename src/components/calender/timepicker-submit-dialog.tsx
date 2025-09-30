import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

import { InviteSessionForm } from "./dialog/invite-session-form";
import { useDialogStore } from "@/store/dialogStore";
import dayjs from "../../utils/dayjs";
import { useViewportHeight } from "@/hooks/useViewPortHeight";

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

    // console.log(selectedDate);

    const persianDate = dayjs(selectedDate?.start)
      .calendar("jalali")
      .locale("fa")
      .format("YYYY/MM/DD");

    // console.log(persianDate);

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
      return;
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

    const vh = useViewportHeight();

    return (
      <Dialog open={open} onOpenChange={setOpen} modal={true}>
        {/* <div
          className={` ${
            open ? "fixed" : "hidden"
          } bg-black w-full h-screen top-0 left-0 z-[10000] opacity-70 backdrop-blur-3xl`}
        > */}
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          // className="sm:max-w-[80dvh] overflow-auto"
          // style={{
          //   WebkitOverflowScrolling: "touch",
          //   maxHeight: `100vh`,
          //   // top: 0,
          //   zIndex: 10001,
          //   overflow: "auto",
          // }}
          className="overflow-auto translate-y-0 top-5 light-scroll"
          style={{
            maxHeight: vh * 0.9, // 90% of available space
            WebkitOverflowScrolling: "touch",
          }}
        >
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
        {/* </div> */}
      </Dialog>
    );
  };
