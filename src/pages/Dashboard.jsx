import AttendanceCard from "../components/dashboard/AttendanceCard";
import AttendanceCalendar from "../components/dashboard/AttendanceCalendar";
import { useEffect } from "react";
import Wrapper from "../components/layouts/Wrapper";
import useAttendanceStore from "../store/AttendanceStore";
import useUserStore from "../store/UserStore";

export default function Dashboard() {
  const attendanceData = useAttendanceStore((state) => state.attendance);
  const historyData = useAttendanceStore((state) => state.history);
  const userData = useUserStore((state) => state.user);
  const fetchDashboard = useAttendanceStore((state) => state.fetchDashboard);
  const fetchUserById = useUserStore((state) => state.fetchUserById);

  const fetchToday = async () => {
    try {
      await Promise.all([fetchDashboard(), fetchUserById()]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchToday();
  }, []);

  return (
    <Wrapper>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome to HRIS</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AttendanceCard
            data={{
              attendance: attendanceData,
              user: userData,
            }}
          />
        </div>
        <div className="lg:col-span-1">
          <AttendanceCalendar
            attendance={historyData}
          />
        </div>
      </div>
    </Wrapper>
  );
}
