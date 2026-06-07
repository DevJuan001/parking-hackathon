export default function Loader({ invert = false }) {
  return (
    <span
      className={`inline-block w-5 h-5 rounded-[50%] border-2 ${invert ? "border-black" : "border-white"} border-b-transparent animate-rotation 
      dark:border-black dark:border-b-transparent`}
    />
  );
}
