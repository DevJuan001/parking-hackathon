export default function ProgressBar({ progress }) {
  return (
    <div
      className="relative mt-5 h-2 w-[400px] rounded-3xl bg-[#E4E2E5]
      dark:bg-[#28282B]"
    >
      <div
        style={{ width: progress }}
        className={`absolute top-0 h-full max-w-full rounded-2xl bg-black transition-all duration-700
        dark:bg-white`}
      />
    </div>
  );
}
