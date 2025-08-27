import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import vitaminaDImage from "@/assets/vitamina-d.webp";
import ferritinaImage from "@/assets/ferritina.webp";

export type Recommendation = "Vitamina D" | "Ferritina" | "Evaluación clínica general";

type NodeId =
  | "Q1"
  | "Q2"
  | "Q3"
  | "Q4"
  | "Q5"
  | "Q6"
  | "Q7"
  | "RESULT";

type Step = {
  id: NodeId;
  question?: string;
  yes?: NodeId | "RESULT:Vitamina D" | "RESULT:Ferritina" | "RESULT:Evaluación clínica general";
  no?: NodeId | "RESULT:Vitamina D" | "RESULT:Ferritina" | "RESULT:Evaluación clínica general";
};

const STEPS: Record<Exclude<NodeId, "RESULT">, Step> = {
  Q1: {
    id: "Q1",
    question: "¿Presenta cansancio, fatiga o debilidad persistente?",
    yes: "Q2",
    no: "Q3",
  },
  Q2: {
    id: "Q2",
    question:
      "¿Ha tenido palidez, mareos, dolor de cabeza frecuente o dificultad para concentrarse?",
    yes: "RESULT:Ferritina",
    no: "Q3",
  },
  Q3: {
    id: "Q3",
    question:
      "¿Pasa la mayor parte del tiempo en interiores o con poca exposición solar?",
    yes: "RESULT:Vitamina D",
    no: "Q4",
  },
  Q4: {
    id: "Q4",
    question:
      "¿Presenta dolores musculares, óseos o calambres sin causa aparente?",
    yes: "RESULT:Vitamina D",
    no: "Q5",
  },
  Q5: {
    id: "Q5",
    question:
      "¿Ha notado uñas quebradizas, caída de cabello, piel más pálida o dificultad para mantener la energía en actividades cotidianas?",
    yes: "RESULT:Ferritina",
    no: "Q6",
  },
  Q6: {
    id: "Q6",
    question:
      "¿Ha tenido dolor o rigidez en las articulaciones, debilidad muscular o sensación de ‘menos fuerza’ al realizar actividades diarias?",
    yes: "RESULT:Vitamina D",
    no: "Q7",
  },
  Q7: {
    id: "Q7",
    question:
      "¿Ha tenido sangrado reciente o crónico (digestivo, urinario, nasal, donaciones frecuentes, menstruaciones abundantes en mujeres)?",
    yes: "RESULT:Ferritina",
    no: "RESULT:Evaluación clínica general",
  },
};

const TOTAL_QUESTIONS = 7;

export function HealthDecisionWizard() {
  const [currentId, setCurrentId] = useState<Exclude<NodeId, "RESULT">>("Q1");
  const [answered, setAnswered] = useState<{ id: string; value: "Sí" | "No" }[]>([]);
  const [result, setResult] = useState<Recommendation | null>(null);
  const [savedResult, setSavedResult] = useState<Recommendation | null>(null);

  const progress = useMemo(() => {
    const count = result ? answered.length : answered.length + 1;
    return Math.min(100, Math.round((count / TOTAL_QUESTIONS) * 100));
  }, [answered.length, result]);

  const handleAnswer = (value: "Sí" | "No") => {
    const step = STEPS[currentId];
    if (!step) return;
    setAnswered((prev) => [...prev, { id: currentId, value }]);

    const next = value === "Sí" ? step.yes : step.no;
    if (!next) return;

    // Si es un resultado y no hemos guardado uno aún, guardarlo
    if (next.startsWith("RESULT:") && !savedResult) {
      const rec = next.split(":")[1] as Recommendation;
      setSavedResult(rec);
    }

    // Si llegamos a Q7, mostrar el resultado
    if (currentId === "Q7") {
      const finalResult = savedResult || (next.startsWith("RESULT:") ? next.split(":")[1] as Recommendation : "Evaluación clínica general");
      setResult(finalResult);
      toast({
        title: "Resultado disponible",
        description:
          finalResult === "Vitamina D"
            ? "Recomendación: medir niveles de Vitamina D"
            : finalResult === "Ferritina"
            ? "Recomendación: evaluar Ferritina (hierro)"
            : "Sugerencia: realizar evaluación clínica general",
      });
      return;
    }

    // Continuar a la siguiente pregunta
    if (next.startsWith("RESULT:")) {
      // Si es un resultado pero no estamos en Q7, continuar con la siguiente pregunta secuencial
      const nextQuestionNumber = parseInt(currentId.substring(1)) + 1;
      if (nextQuestionNumber <= 7) {
        setCurrentId(`Q${nextQuestionNumber}` as Exclude<NodeId, "RESULT">);
      }
    } else {
      setCurrentId(next as Exclude<NodeId, "RESULT">);
    }
  };

  const reset = () => {
    setCurrentId("Q1");
    setAnswered([]);
    setResult(null);
    setSavedResult(null);
  };

  const step = STEPS[currentId];

  return (
    <Card className="relative overflow-hidden border-2 shadow-[var(--shadow-elegant)] bg-gradient-to-br from-background to-accent/20 w-full max-w-5xl mx-auto">
      <div className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(60%_60%_at_50%_30%,black,transparent)]">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-br from-[hsl(var(--primary)/0.25)] to-[hsl(var(--primary-glow)/0.25)] blur-3xl animate-float" />
      </div>
      
      <CardContent className="p-6 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-2xl text-muted-foreground">
            <span className="font-medium">Pregunta {currentId.slice(1)} de 7</span>
            <span className="font-bold">{progress}%</span>
          </div>
          <Progress value={progress} className="h-4" />
        </div>

        {!result && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-accent/40 to-accent/20 rounded-3xl p-8 border border-accent/50 text-center min-h-[200px] flex items-center justify-center">
              <p className="text-3xl font-semibold leading-relaxed text-foreground max-w-4xl">
                {step.question}
              </p>
            </div>
            
            <div className="flex gap-8 max-w-4xl mx-auto">
              <Button 
                variant="hero" 
                size="lg" 
                onClick={() => handleAnswer("Sí")} 
                aria-label="Responder Sí" 
                className="flex-1 h-32 text-4xl font-bold rounded-3xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 touch-manipulation"
              >
                Sí
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => handleAnswer("No")} 
                aria-label="Responder No" 
                className="flex-1 h-32 text-4xl font-bold rounded-3xl border-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 touch-manipulation"
              >
                No
              </Button>
            </div>

            {answered.length > 0 && (
              <div className="text-center">
                <Button 
                  variant="ghost" 
                  onClick={reset} 
                  aria-label="Reiniciar cuestionario" 
                  className="text-2xl px-12 py-6 rounded-2xl hover:bg-accent/20 transition-colors touch-manipulation"
                >
                  Reiniciar evaluación
                </Button>
              </div>
            )}
          </div>
        )}

        {result && (
          <div className="space-y-8 text-center">
            <div role="status" aria-live="polite" className="bg-gradient-to-r from-[hsl(var(--primary)/0.15)] to-[hsl(var(--primary-glow)/0.15)] rounded-3xl p-8 border border-primary/30">
              <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] bg-clip-text text-transparent">
                Tu recomendación
              </h3>
              <p className="text-2xl text-muted-foreground leading-relaxed">
                {result === "Vitamina D" && (
                  <>
                    Se sugiere priorizar la medición de <strong className="text-foreground bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] bg-clip-text text-transparent">Vitamina D</strong>
                  </>
                )}
                {result === "Ferritina" && (
                  <>
                    Se sugiere priorizar la medición de <strong className="text-foreground bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] bg-clip-text text-transparent">Ferritina</strong> (estado de hierro)
                  </>
                )}
                {result === "Evaluación clínica general" && (
                  <>
                    Considera una <strong className="text-foreground bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] bg-clip-text text-transparent">evaluación clínica general</strong> con tu profesional de salud
                  </>
                )}
              </p>
            </div>

            {/* Product Image */}
            {(result === "Vitamina D" || result === "Ferritina") && (
              <div className="flex justify-center">
                <div className="relative max-w-lg">
                  <img
                    src={result === "Vitamina D" ? vitaminaDImage : ferritinaImage}
                    alt={`Prueba de ${result} - Kit de análisis`}
                    loading="lazy"
                    decoding="async"
                    className="w-full rounded-3xl border-2 border-primary/20 shadow-[var(--shadow-elegant)] transform hover:scale-105 transition-all duration-300"
                  />
                </div>
              </div>
            )}
            
            <div className="flex justify-center">
              <Button 
                variant="hero" 
                onClick={reset} 
                size="lg" 
                className="h-32 text-4xl font-bold rounded-3xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-16 touch-manipulation"
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
