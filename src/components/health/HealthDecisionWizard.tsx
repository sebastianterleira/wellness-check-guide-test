import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import vitaminaDImage from "@/assets/vitamina-d.webp";
import ferritinaImage from "@/assets/ferritina.webp";

export type Recommendation = "Vitamina D" | "Ferritina" | "Ambas pruebas" | "Consulta médica";

type Question = {
  id: string;
  text: string;
};

const QUESTIONS: Question[] = [
  {
    id: "Q1",
    text: "¿Te sientes con cansancio o fatiga la mayor parte del tiempo?"
  },
  {
    id: "Q2", 
    text: "¿Presentas piel pálida o palidez en mucosas (labios, encías, párpados)?"
  },
  {
    id: "Q3",
    text: "¿Se te cae el cabello con mayor frecuencia de lo normal?"
  },
  {
    id: "Q4",
    text: "¿Has tenido debilidad muscular o dolor en los huesos/articulaciones?"
  },
  {
    id: "Q5",
    text: "¿Has estado expuesto poco al sol en los últimos meses?"
  },
  {
    id: "Q6",
    text: "¿Has tenido resfriados o infecciones frecuentes en el último tiempo?"
  },
  {
    id: "Q7",
    text: "¿Consumes alimentos ricos en hierro de origen animal (carne, pollo, pescado) al menos 3 veces por semana?"
  }
];

// Preguntas que indican necesidad de prueba de Ferritina: 1, 2, 3, 7
const FERRITINA_QUESTIONS = ["Q1", "Q2", "Q3", "Q7"];

// Preguntas que indican necesidad de prueba de Vitamina D: 4, 5, 6  
const VITAMINA_D_QUESTIONS = ["Q4", "Q5", "Q6"];

const TOTAL_QUESTIONS = QUESTIONS.length;

export function HealthDecisionWizard() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: "Sí" | "No" }>({});
  const [result, setResult] = useState<Recommendation | null>(null);

  const progress = useMemo(() => {
    const answeredCount = Object.keys(answers).length;
    const count = result ? answeredCount : answeredCount + 1;
    return Math.min(100, Math.round((count / TOTAL_QUESTIONS) * 100));
  }, [answers, result]);

  const calculateRecommendation = (allAnswers: { [key: string]: "Sí" | "No" }): Recommendation => {
    // Contar respuestas "Sí" para cada categoría
    const ferritinaScore = FERRITINA_QUESTIONS.reduce((count, questionId) => {
      // Para Q7 (consumo de hierro), "No" indica necesidad de Ferritina
      if (questionId === "Q7") {
        return count + (allAnswers[questionId] === "No" ? 1 : 0);
      }
      return count + (allAnswers[questionId] === "Sí" ? 1 : 0);
    }, 0);

    const vitaminaDScore = VITAMINA_D_QUESTIONS.reduce((count, questionId) => {
      return count + (allAnswers[questionId] === "Sí" ? 1 : 0);
    }, 0);

    // Aplicar lógica de decisión
    const needsFerritina = ferritinaScore >= 2;
    const needsVitaminaD = vitaminaDScore >= 2;

    if (needsFerritina && needsVitaminaD) {
      return "Ambas pruebas";
    } else if (needsFerritina) {
      return "Ferritina";
    } else if (needsVitaminaD) {
      return "Vitamina D";
    } else {
      return "Consulta médica";
    }
  };

  const handleAnswer = (value: "Sí" | "No") => {
    const currentQuestion = QUESTIONS[currentQuestionIndex];
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    // Si es la última pregunta, calcular resultado
    if (currentQuestionIndex === TOTAL_QUESTIONS - 1) {
      const recommendation = calculateRecommendation(newAnswers);
      setResult(recommendation);
      
      toast({
        title: "Evaluación completada",
        description: "Tu recomendación personalizada está lista",
      });
    } else {
      // Continuar a la siguiente pregunta
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const reset = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
  };

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  return (
    <Card className="relative overflow-hidden border-2 shadow-[var(--shadow-elegant)] bg-gradient-to-br from-background to-accent/20 max-w-none">
      <div className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(60%_60%_at_50%_30%,black,transparent)]">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-br from-[hsl(var(--primary)/0.25)] to-[hsl(var(--primary-glow)/0.25)] blur-3xl animate-float" />
      </div>
      
      <CardContent className="p-8 lg:p-12 space-y-8 lg:space-y-12">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-lg lg:text-xl text-muted-foreground">
            <span className="font-medium">Pregunta {currentQuestionIndex + 1} de {TOTAL_QUESTIONS}</span>
            <span className="font-bold">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3 lg:h-4" />
        </div>

        {!result && (
          <div className="space-y-8 lg:space-y-12">
            <div className="bg-gradient-to-r from-accent/40 to-accent/20 rounded-2xl p-8 lg:p-12 border border-accent/50 text-center">
              <p className="text-2xl lg:text-4xl xl:text-5xl font-semibold leading-relaxed text-foreground">
                {currentQuestion.text}
              </p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-2xl mx-auto">
              <Button 
                variant="hero" 
                size="lg" 
                onClick={() => handleAnswer("Sí")} 
                aria-label="Responder Sí" 
                className="flex-1 h-20 lg:h-24 text-2xl lg:text-3xl font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Sí
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => handleAnswer("No")} 
                aria-label="Responder No" 
                className="flex-1 h-20 lg:h-24 text-2xl lg:text-3xl font-bold rounded-2xl border-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                No
              </Button>
            </div>

            {Object.keys(answers).length > 0 && (
              <div className="text-center">
                <Button 
                  variant="ghost" 
                  onClick={reset} 
                  aria-label="Reiniciar cuestionario" 
                  className="text-lg lg:text-xl px-8 py-4 rounded-xl hover:bg-accent/20 transition-colors"
                >
                  Reiniciar evaluación
                </Button>
              </div>
            )}
          </div>
        )}

        {result && (
          <div className="space-y-8 lg:space-y-12 text-center">
            <div role="status" aria-live="polite" className="bg-gradient-to-r from-[hsl(var(--primary)/0.15)] to-[hsl(var(--primary-glow)/0.15)] rounded-2xl p-8 lg:p-12 border border-primary/30">
              <h3 className="text-3xl lg:text-5xl xl:text-6xl font-bold mb-6 lg:mb-8 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] bg-clip-text text-transparent">
                Tu recomendación
              </h3>
              <p className="text-xl lg:text-3xl xl:text-4xl text-muted-foreground leading-relaxed">
                {result === "Vitamina D" && (
                  <>
                    Se recomienda realizar la prueba de <strong className="text-foreground bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] bg-clip-text text-transparent">Vitamina D</strong>
                  </>
                )}
                {result === "Ferritina" && (
                  <>
                    Se recomienda realizar la prueba de <strong className="text-foreground bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] bg-clip-text text-transparent">Ferritina</strong>
                  </>
                )}
                {result === "Ambas pruebas" && (
                  <>
                    Se recomienda realizar <strong className="text-foreground bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] bg-clip-text text-transparent">ambas pruebas: Ferritina y Vitamina D</strong>
                  </>
                )}
                {result === "Consulta médica" && (
                  <>
                    Se recomienda una <strong className="text-foreground bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] bg-clip-text text-transparent">consulta médica</strong> para orientación adicional
                  </>
                )}
              </p>
            </div>

            {/* Product Images */}
            {(result === "Vitamina D" || result === "Ferritina" || result === "Ambas pruebas") && (
              <div className={`flex justify-center ${result === "Ambas pruebas" ? "gap-6" : ""}`}>
                {(result === "Vitamina D" || result === "Ambas pruebas") && (
                  <div className={`relative ${result === "Ambas pruebas" ? "w-80 h-80" : "max-w-md lg:max-w-lg"}`}>
                    <img
                      src={vitaminaDImage}
                      alt="Prueba de Vitamina D - Kit de análisis"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain rounded-2xl border-2 border-primary/20 shadow-[var(--shadow-elegant)] transform hover:scale-105 transition-all duration-300"
                    />
                  </div>
                )}
                {(result === "Ferritina" || result === "Ambas pruebas") && (
                  <div className={`relative ${result === "Ambas pruebas" ? "w-80 h-80" : "max-w-md lg:max-w-lg"}`}>
                    <img
                      src={ferritinaImage}
                      alt="Prueba de Ferritina - Kit de análisis"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain rounded-2xl border-2 border-primary/20 shadow-[var(--shadow-elegant)] transform hover:scale-105 transition-all duration-300"
                    />
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-center max-w-2xl mx-auto">
              <Button 
                variant="hero" 
                onClick={reset} 
                size="lg" 
                className="h-20 lg:h-24 text-2xl lg:text-3xl font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-12 lg:px-16"
              >
                Nueva evaluación
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}