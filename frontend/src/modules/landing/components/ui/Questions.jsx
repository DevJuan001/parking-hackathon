import { useState } from "react";
import Icon from "../../../../globals/components/ui/Icon";
import { questions } from "../../data/questions";

export default function Questions() {
  const [openQuestions, setOpenQuestions] = useState(new Set());

  const toggleQuestion = (index) => {
    setOpenQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <section id="questions" className="w-full flex flex-col items-center gap-3">
      <span className="mt-28 text-5xl font-semibold dark:text-[#e4e2e5]">
        Preguntas Frecuentes
      </span>

      <p
        className="max-w-2xl text-xl text-center text-[#75777e] font-medium
        dark:text-[#7E8088]"
      >
        Conoce las respuestas a las consultas más frecuentes sobre la
        implementación, funcionamiento y beneficios de nuestra solución para
        parqueaderos.
      </p>

      <div className="w-4xl flex flex-col gap-2">
        {questions.map((question, index) => {
          const isOpen = openQuestions.has(index);

          return (
            <div
              key={index}
              onClick={() => toggleQuestion(index)}
              className="flex flex-col p-5 gap-3 border border-[#e5e7eb] rounded-2xl bg-[#f5f3f6]
              hover:cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{question.question}</span>

                <Icon
                  name="keyboard_arrow_down"
                  className={`transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`}
                />
              </div>

              <div className={`${isOpen ? "inline-block" : "hidden"}`}>
                {question.answer}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
