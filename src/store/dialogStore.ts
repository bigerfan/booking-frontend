import { create } from "zustand";
import axios from "axios";
import { socket } from "@/lib/socket";

type InvitedPerson = {
  fullName: string;
  phoneNumber: string;
};

type DialogState = {
  tableId: number | null;
  open: boolean;
  step: number;
  selectedDate: { start: string; end: string } | null;
  sessionTitle: string | null;
  // selectedTime: { start: string; end: string } | null;
  invitedPeople: InvitedPerson[];
  sessionDescription: string;
  formLoading: boolean;

  // actions
  setOpen: (open: boolean) => void;
  setFormLoading: (state: boolean) => void;
  resetDialog: () => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setTableId: (id: number) => void;
  setSelectedDate: (date: { start: string; end: string } | null) => void;
  setSessionTitle: (text: string) => void;
  // setSelectedTime: (time: { start: string; end: string } | null) => void;
  addInvitedPerson: (person: InvitedPerson) => void;
  removeInvitedPerson: (index: number) => void;
  setSessionDescription: (desc: string) => void;
  submitSession: () => void;
};

export const useDialogStore = create<DialogState>((set, get) => ({
  tableId: null,
  open: false,
  formLoading: false,
  step: 1,
  selectedDate: null,
  selectedTime: null,
  invitedPeople: [],
  sessionDescription: "",
  sessionTitle: "",

  setOpen: (open) => set({ open }),
  setFormLoading: (state) => set({ formLoading: state }),
  resetDialog: () =>
    set({
      step: 1,
      // selectedTime: null,
      invitedPeople: [],
      selectedDate: null,
      sessionDescription: "",
    }),
  setSessionTitle: (text) =>
    set({
      sessionTitle: text,
    }),
  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  setTableId: (id) => set({ tableId: id }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  // setSelectedTime: (time) => set({ selectedTime: time }),
  addInvitedPerson: (person) =>
    set((state) => ({ invitedPeople: [...state.invitedPeople, person] })),
  removeInvitedPerson: (index) =>
    set((state) => ({
      invitedPeople: state.invitedPeople.filter((_, i) => i !== index),
    })),
  setSessionDescription: (desc) => set({ sessionDescription: desc }),
  submitSession: async () => {
    const {
      tableId,
      invitedPeople,
      sessionDescription,
      selectedDate,
      // selectedTime,
      resetDialog,
      setOpen,
      setFormLoading,
      sessionTitle,
    } = get();
    setFormLoading(true);
    if (!selectedDate?.start || !selectedDate?.end) return;

    // const sessionDate = new Date(`${selectedDate}T${selectedTime}:00`);
    // if (!sessionDate) {
    //   console.log(sessionDate);
    //   return;
    // }
    try {
      const res = await axios.post("http://localhost:5000/api/session/create", {
        invitedPeople,
        sessionDescription,
        startedTime: selectedDate.start,
        endTime: selectedDate.end,
        title: sessionTitle,
        tableId,
      });

      if (res.status == 200) {
        resetDialog();
        setOpen(false);
        socket.emit("new-session", tableId);
      }
    } catch (error) {
      console.log(error);
    }

    setFormLoading(false);

    // socket.emit("create-session", {
    //   invitedPeople,
    //   sessionDescription,
    //   date: selectedDate,
    //   time: selectedTime,
    // });
  },
}));
