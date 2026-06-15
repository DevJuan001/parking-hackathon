import { features } from "../../data/features";

export default function Features() {
  return (
    <section id="#features" className="w-full flex flex-col gap-4 items-center">
      <span className="font-medium dark:text-[#e4e2e5]">Características</span>

      <span className="text-5xl font-semibold dark:text-[#e4e2e5]">
        Potencia tu operación
      </span>

      <span className="max-w-xl text-xl text-center font-medium dark:text-[#7E8088]">
        Todo lo que necesitas para gestionar tu parqueadero de forma eficiente
        desde una sola plataforma.
      </span>

      <div className="mt-5 w-[1500px] flex flex-col px-1 gap-2 rounded-full">
        {features.map((feature, index) => (
          <div
            className={`w-full flex ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"} p-2 bg-[#101012] rounded-3xl
            dark:text-white`}
          >
            <img
              src="/public/parking-1.png"
              alt={`${feature.name}-image`}
              className="h-[400px] rounded-2xl aspect-video"
            />

            <div className="flex flex-col justify-center p-12 gap-2">
              <span className="text-5xl font-semibold text-[#e4e2e5]">
                {feature.name}
              </span>

              <span className="text-2xl text-[#7E8088]">
                {feature.description}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
