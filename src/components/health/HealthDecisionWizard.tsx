import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Question {
  id: number;
  text: string;
  yesAction: "ferritina" | "vitamina_d" | "next";
  noAction: "ferritina" | "vitamina_d" | "next";
  yesNextQuestion?: number;
  noNextQuestion?: number;
}

const questions: Question[] = [
  {
    id: 1,
    text: "¿Presenta cansancio, fatiga o debilidad persistente?",
    yesAction: "next",
    noAction: "next",
    yesNextQuestion: 2,
    noNextQuestion: 3
  },
  {
    id: 2,
    text: "¿Ha tenido palidez, mareos, dolor de cabeza frecuente o dificultad para concentrarse?",
    yesAction: "ferritina",
    noAction: "next",
    noNextQuestion: 3
  },
  {
    id: 3,
    text: "¿Pasa la mayor parte del tiempo en interiores o con poca exposición solar?",
    yesAction: "vitamina_d",
    noAction: "next",
    noNextQuestion: 4
  },
  {
    id: 4,
    text: "¿Presenta dolores musculares, óseos o calambres sin causa aparente?",
    yesAction: "vitamina_d",
    noAction: "next",
    noNextQuestion: 5
  },
  {
    id: 5,
    text: "¿Ha notado uñas quebradizas, caída de cabello, piel más pálida o dificultad para mantener la energía en actividades cotidianas?",
    yesAction: "ferritina",
    noAction: "next",
    noNextQuestion: 6
  },
  {
    id: 6,
    text: "¿Ha tenido dolor o rigidez en las articulaciones, debilidad muscular o sensación de 'menos fuerza' al realizar actividades diarias?",
    yesAction: "vitamina_d",
    noAction: "next",
    noNextQuestion: 7
  },
  {
    id: 7,
    text: "¿Ha tenido sangrado reciente o crónico (digestivo, urinario, nasal, donaciones frecuentes, menstruaciones abundantes en mujeres)?",
    yesAction: "ferritina",
    noAction: "next"
  }
];

const HealthDecisionWizard = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [savedResult, setSavedResult] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (answer: "yes" | "no") => {
    const question = questions.find(q => q.id === currentQuestion);
    if (!question) return;

    const action = answer === "yes" ? question.yesAction : question.noAction;
    const nextQuestion = answer === "yes" ? question.yesNextQuestion : question.noNextQuestion;

    // Save the first result we encounter but don't show it yet
    if ((action === "ferritina" || action === "vitamina_d") && !savedResult) {
      setSavedResult(action);
    }

    if (action === "next" && nextQuestion) {
      setCurrentQuestion(nextQuestion);
    } else {
      // We've reached the end of the questionnaire
      const finalResult = savedResult || action;
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(1);
    setSavedResult(null);
    setShowResult(false);
  };

  const getCurrentQuestion = () => {
    return questions.find(q => q.id === currentQuestion);
  };

  if (showResult) {
    const result = savedResult || "ferritina";
    
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            Resultado del Cuestionario
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <h3 className="text-xl font-semibold mb-4 text-primary">
              Recomendación: {result === "ferritina" ? "Examen de Ferritina" : "Examen de Vitamina D"}
            </h3>
            <p className="text-muted-foreground">
              {result === "ferritina" 
                ? "Basado en sus respuestas, le recomendamos realizarse un examen de ferritina para evaluar sus niveles de hierro."
                : "Basado en sus respuestas, le recomendamos realizarse un examen de vitamina D para evaluar sus niveles."
              }
            </p>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={resetQuiz}
              className="w-full h-12"
              size="lg"
            >
              Realizar el cuestionario nuevamente
            </Button>
            
            <div className="text-sm text-muted-foreground">
              <p>*Esta es una recomendación preliminar. Consulte siempre con su médico para un diagnóstico profesional.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const question = getCurrentQuestion();
  
  if (!question) {
    return <div>Error: Pregunta no encontrada</div>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold text-primary">
          Cuestionario de Salud
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Pregunta {currentQuestion} de {questions.length}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-6">{question.text}</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => handleAnswer("yes")}
            className="flex-1 h-12 sm:h-10"
            size="lg"
          >
            Sí
          </Button>
          <Button
            onClick={() => handleAnswer("no")}
            variant="outline"
            className="flex-1 h-12 sm:h-10"
            size="lg"
          >
            No
          </Button>
        </div>
        
        <div className="text-center text-xs text-muted-foreground">
          <p>Responda con sinceridad para obtener la mejor recomendación</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthDecisionWizard;