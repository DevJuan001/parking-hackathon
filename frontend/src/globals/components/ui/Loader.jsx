export default function Loader({ invert = false }) {
  return (
    <span
      className={`inline-block w-5 h-5 rounded-2xl border-b-transparent! border-2 animate-rotation
      ${invert ? "border-black!" : "border-white"}`}
    />
  );
}
