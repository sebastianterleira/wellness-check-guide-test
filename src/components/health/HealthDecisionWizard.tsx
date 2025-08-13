import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

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

    if (next.startsWith("RESULT:")) {
      const rec = next.split(":")[1] as Recommendation;
      setResult(rec);
      toast({
        title: "Resultado disponible",
        description:
          rec === "Vitamina D"
            ? "Recomendación: medir niveles de Vitamina D"
            : rec === "Ferritina"
            ? "Recomendación: evaluar Ferritina (hierro)"
            : "Sugerencia: realizar evaluación clínica general",
      });
      return;
    }

    setCurrentId(next as Exclude<NodeId, "RESULT">);
  };

  const reset = () => {
    setCurrentId("Q1");
    setAnswered([]);
    setResult(null);
  };

  const step = STEPS[currentId];

  return (
    <Card className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(60%_60%_at_50%_30%,black,transparent)]">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-br from-[hsl(var(--primary)/0.25)] to-[hsl(var(--primary-glow)/0.25)] blur-3xl animate-float" />
      </div>
      <CardHeader>
        <CardTitle>Evaluación rápida</CardTitle>
        <CardDescription>
          Responde con Sí o No. No reemplaza el criterio médico.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Progreso</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {!result && (
          <div className="space-y-6">
            <p className="text-lg font-medium leading-relaxed">{step.question}</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="hero" size="lg" onClick={() => handleAnswer("Sí")} aria-label="Responder Sí">
                Sí
              </Button>
              <Button variant="outline" size="lg" onClick={() => handleAnswer("No")} aria-label="Responder No">
                No
              </Button>
              {answered.length > 0 && (
                <Button variant="ghost" onClick={reset} aria-label="Reiniciar cuestionario">
                  Reiniciar
                </Button>
              )}
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div role="status" aria-live="polite" className="space-y-2">
              <h3 className="text-2xl font-semibold">Recomendación</h3>
              <p className="text-muted-foreground">
                {result === "Vitamina D" && (
                  <>
                    Se sugiere priorizar la medición de <strong>Vitamina D</strong>.
                  </>
                )}
                {result === "Ferritina" && (
                  <>
                    Se sugiere priorizar la medición de <strong>Ferritina</strong> (estado de hierro).
                  </>
                )}
                {result === "Evaluación clínica general" && (
                  <>
                    Considera una <strong>evaluación clínica general</strong> con tu profesional de salud.
                  </>
                )}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {result === "Vitamina D" && (
                <Button asChild variant="hero">
                  <a href="#vitamina-d">Ver prueba de Vitamina D</a>
                </Button>
              )}
              {result === "Ferritina" && (
                <Button asChild variant="hero">
                  <a href="#ferritina">Ver prueba de Ferritina</a>
                </Button>
              )}
              <Button variant="ghost" onClick={reset}>Realizar nuevamente</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
