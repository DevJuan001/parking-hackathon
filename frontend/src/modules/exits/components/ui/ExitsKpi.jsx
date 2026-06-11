export default function ExitsKpi({ title, value }) {
  return (
    <div
      className="w-full flex flex-col items-start py-5 px-6 rounded-2xl bg-[#f5f3f6]
      dark:bg-[#101012] dark:text-[#e4e2e5]"
    >
      <span className="text-sm text-[#75777E] dark:text-[#7E8088]">{title}</span>
      <span className="text-2xl font-medium">{value}</span>
    </div>
  );
}
