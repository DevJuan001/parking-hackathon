import Icon from "../../../../globals/components/ui/Icon";
import { pricingPlans } from "../../data/pricingPlans";

export default function Pricing({ openModal }) {
  return (
    <section
      id="pricing"
      className="w-full flex flex-col items-center gap-3
      dark:text-white"
    >
      <span className="mt-28 text-5xl font-semibold dark:text-[#e4e2e5]">
        Precios simples y sin complicaciones
      </span>

      <p
        className="max-w-2xl text-xl text-center text-[#75777e] font-medium
        dark:text-[#7E8088]"
      >
        Paga únicamente por el plan que necesitas. Accede a una plataforma
        completa para administrar tu parqueadero, optimizar la operación diaria
        y mejorar el control de tus ingresos desde cualquier lugar.
      </p>

      <div className="mt-8 w-7xl flex items-center justify-center gap-2">
        {pricingPlans.map((plan) => (
          <div
            key={plan.title}
            className="w-full h-[680px] flex flex-col p-7 gap-2 border border-[#e5e7eb] rounded-3xl transition-all duration-500]
            dark:border-[#202022]"
          >
            <span className="text-5xl font-medium dark:text-[#e4e2e5]">
              {plan.title}
            </span>

            <p className="text-xl text-[#758088] leading-7">
              {plan.description}
            </p>

            <span className="mt-4 text-xl text-[#758088]">Incluye:</span>

            <ul className="list-disc list-inside text-[#758088]">
              {plan.items.map((item) => (
                <li key={item.text}>
                  <Icon
                    name={item.icon}
                    size={18}
                    fill
                    className={"align-middle mr-1.5"}
                  />

                  <span>{item.text}</span>
                </li>
              ))}
            </ul>

            <span className="mt-auto flex flex-nowrap items-end gap-1 text-6xl font-semibold">
              {plan.price}
              <span className="mb-1 text-3xl">/ mes</span>
            </span>

            <span className="text-xs text-[#758088]">IVA incluido</span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                openModal(null, "register", e.currentTarget);
              }}
              className="w-full p-5 text-xl bg-black text-white rounded-xl font-medium transition-transform duration-500
              hover:scale-[1.03]
              dark:bg-white dark:text-black"
            >
              Comenzar prueba
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
