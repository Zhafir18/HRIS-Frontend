import { useEffect, useState } from "react";
import useSalaryStore from "../store/SalaryStore";
import useUserStore from "../store/UserStore";
import Wrapper from "../components/layouts/Wrapper";
import Pagination from "../components/ui/Pagination";

export default function Salary() {
  const { salaries, fetchSalaries, loading } = useSalaryStore();
  const user = useUserStore((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (user) {
      fetchSalaries(currentPage, itemsPerPage);
    }
  }, [user, currentPage]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const getMonthName = (month) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[month - 1];
  };

  return (
    <Wrapper>
      <div className="space-y-6 text-left">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">My Salary Slip</h1>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100 uppercase font-bold text-slate-500 text-xs">
              <tr>
                <th className="py-4 px-6 font-bold">Period</th>
                <th className="py-4 px-6 font-bold text-right">Amount</th>
                <th className="py-4 px-6 font-bold text-center">Status</th>
                <th className="py-4 px-6 font-bold text-right">Payment Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {salaries.items.length > 0 ? (
                salaries.items.map((salary) => (
                  <tr key={salary.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-700">{getMonthName(salary.month)} {salary.year}</span>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-slate-900">
                      {formatCurrency(salary.amount)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        salary.status === "PAID" ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                      }`}>
                        {salary.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right text-slate-500">
                      {salary.status === "PAID" ? new Date(salary.updated_at).toLocaleDateString() : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-slate-400 italic">
                    {loading ? "Loading..." : "No salary records found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination 
            currentPage={currentPage}
            totalItems={salaries.total}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </Wrapper>
  );
}
