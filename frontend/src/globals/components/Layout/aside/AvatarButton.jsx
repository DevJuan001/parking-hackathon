import { avatarItem } from "../../../constants/asideMenuItems";
import { useCurrentUser } from "../../../hooks/useCurrentUser";

export default function AvatarButton({ avatarOnClick }) {
  const { user } = useCurrentUser();

  return (
    <button
      onClick={avatarOnClick}
      className="w-full h-full flex items-center py-3 pl-4 gap-3 rounded-2xl transition duration-300 cursor-pointer
        hover:cursor-pointer
        hover:bg-[#e5e7eb96] 
        dark:text-gray-50 dark:hover:bg-[#202022]"
    >
      <img src={avatarItem.icon} alt={avatarItem.alt} className="w-8 h-8" />

      <span className="text-[#75777E] font-medium dark:text-[#7E8088]">
        {user.name} {user.first_surname}
      </span>
    </button>
  );
}
