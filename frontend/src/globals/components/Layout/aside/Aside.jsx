import Navbar from "./Navbar";
import { useCurrentUser } from "../../../hooks/useCurrentUser";

export default function Aside({ avatarOnClick, helpOnClick }) {
  const { hasRole } = useCurrentUser();

  return (
    <aside
      className="sticky flex order-2 h-[80px] py-1 z-10 transition-all duration-700 
      dark:bg-black"
    >
      <Navbar
        hasRole={hasRole}
        helpOnClick={helpOnClick}
        avatarOnClick={avatarOnClick}
      />
    </aside>
  );
}
