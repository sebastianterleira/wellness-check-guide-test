import { Helmet } from "react-helmet-async";
import hero from "@/assets/hero-medical-new.jpg";
import vitaminaDImage from "@/assets/vitamina-d.webp";
import ferritinaImage from "@/assets/ferritina.webp";
import logoImage from "@/assets/logo-previta.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HealthDecisionWizard } from "@/components/health/HealthDecisionWizard";
import { useEffect, useMemo, useState } from "react";

const useCanonical = () => {
  const [url, setUrl] = useState<string>("https://example.com/");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.origin + window.location.pathname);
    }
  }, []);
  return url;
};

const Index = () => {
  const canonical = useCanonical();
  const title = "Test de Salud: Vitamina D vs Ferritina | Guía Rápida";
  const description =
    "Responde 7 preguntas sí/no y recibe recomendación: análisis de Vitamina D o Ferritina. Enfoque médico y bienestar.";

  const faqJsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Qué mide la ferritina?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "La ferritina refleja las reservas de hierro en el organismo y ayuda a evaluar estados de deficiencia o sobrecarga de hierro.",
          },
        },
        {
          "@type": "Question",
          name: "¿Para qué sirve medir la Vitamina D?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Permite conocer el estado de Vitamina D, clave para la salud ósea, muscular e inmunológica.",
          },
        },
        {
          "@type": "Question",
          name: "¿Este formulario reemplaza una consulta médica?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Es una guía orientativa que no sustituye la evaluación de un profesional de la salud.",
          },
        },
      ],
    }),
    []
  );

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={hero} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={hero} />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <main className="min-h-screen relative overflow-hidden flex flex-col">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--primary)/0.05)] via-background to-[hsl(var(--accent)/0.1)]" />
          <div className="absolute left-1/2 top-1/4 -z-10 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-[hsl(var(--primary)/0.15)] to-[hsl(var(--primary-glow)/0.15)] blur-3xl" />
        </div>
        
        <div className="flex-1 flex flex-col justify-center px-8 py-6">
          {/* Compact Header for Totem */}
          <div className="text-center mb-8 flex-shrink-0">
            <div className="mb-4">
              <img 
                src={logoImage} 
                alt="Previta Care - Pruebas médicas" 
                className="h-12 w-auto mx-auto"
              />
            </div>
            <h1 className="text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-glow))] bg-clip-text text-transparent">
              Evaluación de Bienestar
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-2">
              Responde 7 preguntas sí/no y obtén una recomendación personalizada
            </p>
            <p className="text-sm text-muted-foreground/80">
              Esta herramienta no reemplaza una consulta médica profesional
            </p>
          </div>

          {/* Health Decision Wizard - Takes remaining space */}
          <div className="flex-1 flex items-center justify-center max-w-6xl mx-auto w-full">
            <HealthDecisionWizard />
          </div>
        </div>
      </main>
    </>
  );
};

export default Index;
