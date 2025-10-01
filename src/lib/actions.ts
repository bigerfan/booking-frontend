import { apiRoutes, axiosInstance } from "@/utils/axios";

type createSessionType = {
  invitedPeople: { fullName: string; phoneNumber: string }[];
  sessionDescription: string;
  selectedDate: { start: string | Date; end: string | Date };
  sessionTitle: string;
  tableId: string;
};

export async function createSession({
  invitedPeople,
  sessionDescription,
  selectedDate,
  sessionTitle,
  tableId,
}: createSessionType) {
  try {
    const res = await axiosInstance.post(apiRoutes.sessions.create, {
      invitedPeople,
      sessionDescription,
      startedTime: selectedDate.start,
      endTime: selectedDate.end,
      title: sessionTitle,
      tableId,
    });
    return res;
  } catch (error) {
    console.log(error);
  }
}

export async function DeleteSession(id: string | number) {
  if (!id) return;
  try {
    const res = await axiosInstance.post(`${apiRoutes.sessions.delete}/${id}`);
    return res;
  } catch (error) {
    console.log(error);
  }
}
