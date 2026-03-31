import { useState, useRef, useEffect } from "react";

export default function AttendanceCalendar({ attendance }) {
  const [activeTooltip, setActiveTooltip] = useState(null);
  const calendarRef = useRef(null);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const today = now.getDate();

  const getAttendanceForDay = (day) => {
    return attendance.find(
      (att) => new Date(att.log_in_time).getDate() === day
    );
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setActiveTooltip(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow" ref={calendarRef}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg">Attendance History</h3>
        <span className="text-sm font-medium text-gray-400 capitalize">
          {now.toLocaleString("id-ID", { month: "long", year: "numeric" })}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["M", "S", "R", "K", "J", "S", "M"].map((day, i) => (
          <div key={i} className="text-center text-[10px] text-gray-400 font-bold mb-2">
            {day === "M" && i === 0 ? "S" : day}
          </div>
        ))}
        
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`offset-${i}`} className="aspect-square" />
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const record = getAttendanceForDay(day);
          const isCheckedIn = !!record;
          const isToday = day === today;

          return (
            <div
              key={day}
              onClick={() => isCheckedIn && setActiveTooltip(activeTooltip === day ? null : day)}
              className={`aspect-square flex items-center justify-center rounded-xl text-xs font-bold transition-all relative ${isCheckedIn ? 'cursor-pointer hover:ring-2 hover:ring-blue-300' : ''}
                ${isToday ? "ring-2 ring-blue-500 ring-offset-2 z-10" : ""}
                ${
                  isCheckedIn
                    ? "bg-green-100 text-green-700"
                    : day < today 
                      ? "bg-red-50 text-red-500/60" 
                      : "bg-gray-50 text-gray-400"
                }`}
            >
              {day}
              {isCheckedIn && (
                <div className="absolute -bottom-1 w-1 h-1 bg-green-500 rounded-full" />
              )}
              
              {activeTooltip === day && record && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-gray-900 text-white text-xs rounded-xl p-3 shadow-xl z-50 flex flex-col gap-1 origin-bottom">
                  <div className="font-bold text-center border-b border-gray-700 pb-1 mb-1">
                    {day} {now.toLocaleString("id-ID", { month: "short", year: "numeric" })}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">In:</span> 
                    <span className="font-mono">{new Date(record.log_in_time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Out:</span> 
                    <span className="font-mono">{record.log_out_time ? new Date(record.log_out_time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "-"}</span>
                  </div>
                  <div className="flex justify-between mt-1 items-center">
                    <span className="text-gray-400">Status:</span> 
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${record.status === 'Normal' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{record.status}</span>
                  </div>
                  
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 rotate-45"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
