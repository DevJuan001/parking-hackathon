import Icon from "../ui/Icon";

export default function ModalHighSection({ icon, text }) {
  return (
    <div className="w-full h-40 flex justify-between items-center py-3 px-2 gap-2 bg-[#efedf0] rounded-2xl font-inter">
      <button className="self-start flex items-center p-2 rounded-full bg-[#fbf9fc] border">
        <Icon name={"delete"} size={20} />
      </button>

      <div className="flex flex-col items-center">
        <Icon name={icon} size={60} fill />

        <span className="font-semibold text-lg">{text}</span>
      </div>

      <button className="self-start flex items-center p-2 rounded-full bg-[#fbf9fc] border">
        <Icon name={"close"} size={20} />
      </button>
    </div>
  );
}
