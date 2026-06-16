import Icon from "../../../../globals/components/ui/Icon";

export default function Footer() {
  return (
    <footer id="footer" className="mt-16 w-6xl flex flex-col justify-between">
      <div className="h-full flex justify-between py-10">
        <div className="w-md h-full flex flex-col gap-2">
          <div
            className="flex items-center gap-2
            dark:text-[#E2E4E5]"
          >
            <Icon name={"parking_sign"} fill size={35} />

            <span className="text-xl font-semibold">Parking</span>
          </div>

          <p
            className="text-sm text-[#75777e] 
            dark:text-[#7E8088]"
          >
            La forma inteligente de administrar parqueaderos. Automatiza
            procesos, optimiza espacios y controla tu operación en tiempo real
            desde cualquier lugar.
          </p>
        </div>

        <div className="h-full flex flex-col gap-3">
          <span
            className="pl-3 text-lg font-semibold
            dark:text-[#E2E4E5]"
          >
            Recursos
          </span>

          <div className="flex flex-col gap-1.5">
            <a
              href="/#"
              className="flex items-center gap-2 py-1.5 pl-4 pr-7 rounded-2xl text-sm font-medium transition-colors duration-300 text-[#75777e]
              hover:bg-gray-200 dark:hover:bg-[#101012]
              dark:text-[#7E8088]"
            >
              <Icon name={"home"} fill size={20} />

              <span>Inicio</span>
            </a>

            <a
              href="/#features"
              className="flex items-center gap-2 py-1.5 pl-4 pr-7 rounded-2xl text-sm font-medium transition-colors duration-300 text-[#75777e]
              hover:bg-gray-200 dark:hover:bg-[#101012]
              dark:text-[#7E8088]"
            >
              <Icon name={"wand_stars"} fill size={20} />

              <span>Características</span>
            </a>

            <a
              href="/#pricing"
              className="flex items-center gap-2 py-1.5 pl-4 pr-7 rounded-2xl text-sm font-medium transition-colors duration-300 text-[#75777e]
              hover:bg-gray-200 dark:hover:bg-[#101012]
              dark:text-[#7E8088]"
            >
              <Icon name={"attach_money"} fill size={20} />

              <span>Precios</span>
            </a>

            <a
              href="/#questions"
              className="flex items-center gap-2 py-1.5 pl-4 pr-7 rounded-2xl text-sm font-medium transition-colors duration-300 text-[#75777e]
              hover:bg-gray-200 dark:hover:bg-[#101012]
              dark:text-[#7E8088]"
            >
              <Icon name={"question_mark"} fill size={20} />

              <span>Preguntas</span>
            </a>
          </div>
        </div>

        <div className="h-full flex flex-col gap-1">
          <span
            className="pl-2 text-lg font-semibold
            dark:text-[#E2E4E5]"
          >
            Contacto
          </span>

          <a
            target="_blank"
            href="mailto:hackathonparking5@gmail.com"
            className="flex items-center gap-2 py-1.5 pl-4 pr-7 rounded-2xl text-sm font-medium transition-colors duration-300 text-[#75777e]
            hover:bg-gray-200 dark:hover:bg-[#101012]
            dark:text-[#7E8088]"
          >
            <Icon name={"email"} size={20} fill />

            <span>hackathonparking5@gmail.com</span>
          </a>

          <a
            target="_blank"
            href="https://wa.me/3001231231"
            className="flex items-center gap-2 py-1.5 pl-4 pr-7 rounded-2xl text-sm font-medium transition-colors duration-300 text-[#75777e]
            hover:bg-gray-200
            dark:text-[#7E8088] dark:hover:bg-[#101012]"
          >
            <Icon name={"chat_bubble"} size={20} fill />

            <span>+57 3001231231</span>
          </a>

          <a
            target="_blank"
            href="https://wa.me/3001231231"
            className="flex items-center gap-2 py-1.5 pl-4 pr-7 rounded-2xl text-sm font-medium transition-colors duration-300 text-[#75777e]
            hover:bg-gray-200 dark:hover:bg-[#101012]
            dark:text-[#7E8088]"
          >
            <Icon name={"call"} size={20} fill />

            <span>+57 3001231231</span>
          </a>
        </div>
      </div>

      <div
        className="flex items-center justify-between py-10 border-t border-gray-200 text-[#75777e] 
        dark:text-[#7E8088] dark:border-[#202022]"
      >
        <span>© 2026, Parking hackathon • All rights reserved</span>

        <div className="flex items-center gap-5">
          <a href="/privacy-policy">Política de privacidad</a>

          <a href="/cookies">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
