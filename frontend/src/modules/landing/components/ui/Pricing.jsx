import Icon from "../../../../globals/components/ui/Icon";
import { pricingPlans } from "../../data/pricingPlans";

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="w-full flex flex-col items-center
      dark:text-white"
    >
      <span className="mt-32 text-5xl font-semibold dark:text-[#e4e2e5]">
        Elige el plan ideal
      </span>

      <div className="mt-14 w-7xl flex items-center justify-center gap-2">
        {pricingPlans.map((plan) => (
          <div
            key={plan.title}
            className="w-full h-[680px] flex flex-col gap-2 border p-7 rounded-3xl
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
