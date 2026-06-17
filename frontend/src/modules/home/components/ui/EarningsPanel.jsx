import RevenueChart from "../charts/RevenueChart";

export default function EarningsPanel() {
  return (
    <div
      className="h-full w-full px-7 py-6 rounded-[50px] border-3 border-[#EBE6E7]
      dark:text-white dark:border-[#202022]"
    >
      <span className="font-semibold">Ganancias</span>

      <RevenueChart />
    </div>
  );
}
