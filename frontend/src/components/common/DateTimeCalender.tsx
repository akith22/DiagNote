import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getDay, format } from "date-fns";

interface Props {
  availableTimes: string[];
  onChange: (date: string | null) => void; // 👈 return string instead of Date
}

const dayMap: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export default function DateTimePicker({ availableTimes, onChange }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Parse availableTimes into structured object
  const parsedTimes = availableTimes.map((t) => {
    const [day, hours] = t.split(" ");
    const [start, end] = hours.split("-");
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);

    return {
      day: dayMap[day],
      startHour: startH,
      startMinute: startM,
      endHour: endH,
      endMinute: endM,
    };
  });

  const filterDate = (date: Date) => {
    const day = getDay(date);
    return parsedTimes.some((t) => t.day === day);
  };

  const filterTime = (time: Date) => {
    if (!selectedDate) return false;
    const day = getDay(selectedDate);
    const available = parsedTimes.find((t) => t.day === day);
    if (!available) return false;

    const hours = time.getHours();
    const minutes = time.getMinutes();

    const afterStart =
      hours > available.startHour ||
      (hours === available.startHour && minutes >= available.startMinute);

    const beforeEnd =
      hours < available.endHour ||
      (hours === available.endHour && minutes <= available.endMinute);

    return afterStart && beforeEnd;
  };

  return (
    <div className="p-4 border rounded shadow">
      <DatePicker
        selected={selectedDate}
        onChange={(date) => {
          setSelectedDate(date);

          if (date) {
            // 👇 return formatted string without timezone
            const formatted = format(date, "yyyy-MM-dd HH:mm");
            onChange(formatted);
          } else {
            onChange(null);
          }
        }}
        showTimeSelect
        filterDate={filterDate}
        filterTime={filterTime}
        timeIntervals={30}
        dateFormat="MMMM d, yyyy h:mm aa"
        inline
      />
    </div>
  );
}
