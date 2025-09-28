import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TimePickerProps {
  value?: { start: string; end: string } | null;
  onChange: (time: { start: string; end: string }) => void;
  interval?: number; // فاصله زمانی (مثلا هر 30 دقیقه)
  startHour?: number;
  endHour?: number;
  disabledTimes?: string[];
}

export function TimePicker({
  value,
  onChange,
  interval = 30,
  startHour = 8,
  endHour = 22,
  disabledTimes,
}: TimePickerProps) {
  const [startTime, setStartTime] = useState<string | null>(
    value?.start || null
  );
  const [endTime, setEndTime] = useState<string | null>(value?.end || null);

  // تولید لیست زمان‌ها
  const times: string[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const h = hour.toString().padStart(2, "0");
      const m = minute.toString().padStart(2, "0");
      times.push(`${h}:${m}`);
    }
  }

  const handleStartSelect = (time: string) => {
    setStartTime(time);
    if (endTime && time >= endTime) setEndTime(null);
    if (endTime) onChange({ start: time, end: endTime });
  };

  const handleEndSelect = (time: string) => {
    setEndTime(time);
    if (startTime) onChange({ start: startTime, end: time });
  };

  // استایل دکمه‌ها بر اساس وضعیت
  const getButtonVariant = (t: string, selected: string | null) => {
    if (t === selected) return "default";
    return "outline";
  };

  const isEndDisabled = (t: string) =>
    disabledTimes?.includes(t) || (startTime && t <= startTime);

  return (
    <div className="flex gap-6">
      {/* ساعت شروع */}
      <div className="flex flex-col items-center w-32">
        <h4 className="mb-2 text-sm font-semibold text-gray-700">شروع</h4>
        <ScrollArea className="h-64 w-full rounded-lg border border-gray-200 p-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <div className="flex flex-col gap-2">
            {times.map((t) => (
              <Button
                key={t}
                variant={getButtonVariant(t, startTime)}
                className="w-full text-sm"
                onClick={() => handleStartSelect(t)}
                disabled={disabledTimes?.includes(t)}
              >
                {t}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* ساعت پایان */}
      <div className="flex flex-col items-center w-32">
        <h4 className="mb-2 text-sm font-semibold text-gray-700">پایان</h4>
        <ScrollArea className="h-64 w-full rounded-lg border border-gray-200 p-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <div className="flex flex-col gap-2">
            {times.map((t) => (
              <Button
                key={t}
                variant={getButtonVariant(t, endTime)}
                className="w-full text-sm"
                onClick={() => handleEndSelect(t)}
                disabled={isEndDisabled(t) || false}
              >
                {t}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
