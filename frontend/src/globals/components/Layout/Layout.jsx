import Aside from "./aside/Aside";

export default function Layout({ avatarOnClick, helpOnClick, children }) {
  return (
    // Container
    <div className="w-screen h-screen flex flex-col py-3 px-6">
      <main
        className="w-full h-full dark:bg-black overflow-y-auto"
      >
        {children}
      </main>
      <Aside avatarOnClick={avatarOnClick} helpOnClick={helpOnClick} />
    </div>
  );
}
