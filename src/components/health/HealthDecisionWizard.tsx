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
    <Card className="relative overflow-hidden border-2 shadow-[var(--shadow-elegant)] bg-gradient-to-br from-background to-accent/20">
      <div className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(60%_60%_at_50%_30%,black,transparent)]">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-br from-[hsl(var(--primary)/0.25)] to-[hsl(var(--primary-glow)/0.25)] blur-3xl animate-float" />
      </div>
      <CardHeader className="text-center sm:text-left">
        <CardTitle className="text-2xl sm:text-3xl bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] bg-clip-text text-transparent">
          Evaluación rápida
        </CardTitle>
        <CardDescription className="text-base">
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
            <div className="bg-accent/30 rounded-lg p-4 border border-accent">
              <p className="text-lg font-medium leading-relaxed text-center sm:text-left">{step.question}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="hero" size="lg" onClick={() => handleAnswer("Sí")} aria-label="Responder Sí" className="flex-1 sm:flex-none">
                Sí
              </Button>
              <Button variant="outline" size="lg" onClick={() => handleAnswer("No")} aria-label="Responder No" className="flex-1 sm:flex-none">
                No
              </Button>
              {answered.length > 0 && (
                <Button variant="ghost" onClick={reset} aria-label="Reiniciar cuestionario" className="sm:ml-auto">
                  Reiniciar
                </Button>
              )}
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div role="status" aria-live="polite" className="bg-gradient-to-r from-[hsl(var(--primary)/0.1)] to-[hsl(var(--primary-glow)/0.1)] rounded-lg p-6 border border-primary/20 text-center">
              <h3 className="text-2xl sm:text-3xl font-semibold mb-3 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] bg-clip-text text-transparent">
                Recomendación
              </h3>
              <p className="text-lg text-muted-foreground">
                {result === "Vitamina D" && (
                  <>
                    Se sugiere priorizar la medición de <strong className="text-foreground">Vitamina D</strong>.
                  </>
                )}
                {result === "Ferritina" && (
                  <>
                    Se sugiere priorizar la medición de <strong className="text-foreground">Ferritina</strong> (estado de hierro).
                  </>
                )}
                {result === "Evaluación clínica general" && (
                  <>
                    Considera una <strong className="text-foreground">evaluación clínica general</strong> con tu profesional de salud.
                  </>
                )}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {result === "Vitamina D" && (
                <Button asChild variant="hero" size="lg" className="w-full sm:w-auto">
                  <a href="#vitamina-d">Ver prueba de Vitamina D</a>
                </Button>
              )}
              {result === "Ferritina" && (
                <Button asChild variant="hero" size="lg" className="w-full sm:w-auto">
                  <a href="#ferritina">Ver prueba de Ferritina</a>
                </Button>
              )}
              <Button variant="outline" onClick={reset} size="lg" className="w-full sm:w-auto">Realizar nuevamente</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
