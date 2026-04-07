export default function AttendanceSummary({ data }) {
  const checkIn = data?.log_in_time
    ? new Date(data.log_in_time).toLocaleTimeString()
    : "-";

  const checkOut = data?.log_out_time
    ? new Date(data.log_out_time).toLocaleTimeString()
    : "-";

  let totalHours = "-";

  if (data?.log_in_time && data?.log_out_time) {
    const diff = new Date(data.log_out_time) - new Date(data.log_in_time);
    totalHours = (diff / (1000 * 60 * 60)).toFixed(2) + " jam";
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-500 text-sm">Check In</p>
        <p className="font-bold">{checkIn}</p>
      </div>

      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-500 text-sm">Check Out</p>
        <p className="font-bold">{checkOut}</p>
      </div>

      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-500 text-sm">Total Jam</p>
        <p className="font-bold">{totalHours}</p>
      </div>

      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-500 text-sm">Status</p>
        <p
          className={`font-bold ${
            data?.status === "telat" ? "text-red-500" : "text-green-500"
          }`}
        >
          {data?.status || "-"}
        </p>
      </div>
    </div>
  );
}
