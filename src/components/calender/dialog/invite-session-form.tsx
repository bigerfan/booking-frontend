import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDialogStore } from "@/store/dialogStore";
import { useRef } from "react";
import { Trash2, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export const InviteSessionForm = () => {
  const {
    setOpen,
    invitedPeople,
    addInvitedPerson,
    removeInvitedPerson,
    sessionDescription,
    setSessionDescription,
    sessionTitle,
    setSessionTitle,
    submitSession,
    formLoading,
  } = useDialogStore();

  const fullName = useRef<HTMLInputElement>(null);
  const phoneNumber = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    if (!fullName.current?.value || !phoneNumber.current?.value) return;

    addInvitedPerson({
      fullName: fullName.current.value.trim(),
      phoneNumber: phoneNumber.current.value.trim(),
    });

    // clear fields after adding
    fullName.current.value = "";
    phoneNumber.current.value = "";
  };

  return (
    <div dir="rtl" className="space-y-6">
      {/* Session title */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">عنوان جلسه:</h3>
        <Input
          placeholder="عنوان جلسه... "
          value={sessionTitle || ""}
          onChange={(e) => setSessionTitle(e.target.value)}
        />
      </div>

      {/* Add person form */}
      <div className="flex flex-col gap-3">
        <h3 className="font-semibold text-gray-700 mb-2">افراد در جلسه</h3>
        <div className="flex gap-3">
          <Input
            ref={fullName}
            className="flex-1"
            placeholder="نام و نام خانوادگی"
          />
          <Input
            ref={phoneNumber}
            className="flex-1"
            placeholder="شماره موبایل"
          />
        </div>
        <Button
          onClick={handleAdd}
          className="flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          افزودن
        </Button>
      </div>

      {/* Invited people list */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">افراد انتخاب‌شده:</h3>
        {invitedPeople.length === 0 ? (
          <p className="text-sm text-gray-500">هیچ فردی اضافه نشده است.</p>
        ) : (
          <ul className="px-4 py-3 space-y-3 bg-gray-50 rounded-xl shadow-sm border border-gray-200 max-h-64 overflow-y-auto invited-scroll">
            {invitedPeople.map((invited, index) => (
              <li
                key={invited.phoneNumber}
                className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                {/* Name + Phone */}
                <div className="flex flex-col text-right">
                  <h5 className="font-medium text-gray-800">
                    {invited.fullName}
                  </h5>
                  <span className="text-sm text-gray-500">
                    {invited.phoneNumber}
                  </span>
                </div>

                {/* Delete button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => removeInvitedPerson(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Session description */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">توضیحات جلسه:</h3>
        <Textarea
          placeholder="توضیحات یا نکات مربوط به جلسه را وارد کنید..."
          value={sessionDescription}
          onChange={(e) => setSessionDescription(e.target.value)}
          className="resize-none"
        />
      </div>

      {/* Footer actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setOpen(false)}>
          بازگشت
        </Button>
        <Button
          onClick={submitSession}
          disabled={
            !sessionTitle ||
            !sessionDescription ||
            invitedPeople.length === 0 ||
            formLoading
          }
        >
          ثبت جلسه
        </Button>
      </div>
    </div>
  );
};
