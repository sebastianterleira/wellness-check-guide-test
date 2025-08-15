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

      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <a href="/" className="flex items-center">
            <img 
              src={logoImage} 
              alt="Previta Care - Pruebas médicas" 
              className="h-12 w-auto"
            />
          </a>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#evaluacion" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Evaluación
            </a>
            <a href="#vitamina-d" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pruebas
            </a>
            <a href="#ferritina" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Resultados
            </a>
            <a href="#contacto" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Contacto
            </a>
          </nav>
          <Button asChild variant="hero" size="sm" className="hidden md:flex rounded-full px-6">
            <a href="#evaluacion">Comenzar</a>
          </Button>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--accent))] to-background" />
            <div className="absolute left-1/2 top-0 -z-10 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-[hsl(var(--primary)/0.18)] to-[hsl(var(--primary-glow)/0.18)] blur-3xl" />
          </div>
          <div className="container grid gap-10 py-16 md:grid-cols-2 md:py-24 lg:py-28">
            <div className="flex flex-col justify-center gap-6">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl text-center md:text-left">
                Chequeo de Bienestar: ¿Vitamina D o Ferritina?
              </h1>
              <p className="text-lg text-muted-foreground text-center md:text-left">
                Responde 7 preguntas sí/no y obtén una recomendación rápida y orientativa basada en síntomas comunes.
              </p>
              <div className="flex flex-col gap-3 items-center md:flex-row md:items-start">
                <Button asChild variant="hero" size="lg" className="w-full md:w-auto">
                  <a href="#evaluacion">Comenzar evaluación</a>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full md:w-auto">
                  <a href="#vitamina-d">Conocer pruebas</a>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Nota: Esta herramienta no reemplaza una consulta médica profesional.
              </p>
            </div>
            <div className="relative">
              <img
                src={hero}
                alt="Ilustración médica moderna para bienestar, vitamina D y ferritina"
                loading="eager"
                decoding="async"
                className="mx-auto w-full max-w-xl rounded-xl border shadow-[var(--shadow-elegant)]"
              />
            </div>
          </div>
        </section>

        <section id="evaluacion" className="container py-16 md:py-24">
          <div className="mx-auto max-w-3xl">
            <HealthDecisionWizard />
          </div>
        </section>

        <section id="vitamina-d" className="bg-accent/40 py-16 md:py-24">
          <div className="container grid items-center gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold">Prueba de Vitamina D</h2>
              <p className="text-muted-foreground">
                Evalúa tus niveles de Vitamina D, fundamentales para la salud ósea, muscular e inmunológica. Especialmente útil si pasas poco tiempo al sol o tienes dolor muscular.
              </p>
              <ul className="list-disc pl-5 text-muted-foreground">
                <li>Resultados confiables de laboratorio</li>
                <li>Recomendaciones orientativas</li>
                <li>Ideal para chequeos preventivos</li>
              </ul>
              <div className="pt-2">
                <Button asChild variant="hero" className="w-full md:w-auto">
                  <a href="https://previtacare.com/productos/vitamina-d" target="_blank" rel="noopener noreferrer">
                    Solicitar prueba
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src={vitaminaDImage}
                alt="Prueba de Vitamina D - Kit de análisis"
                loading="lazy"
                decoding="async"
                className="mx-auto w-full max-w-md rounded-xl border shadow-[var(--shadow-elegant)]"
              />
            </div>
          </div>
        </section>

        <section id="ferritina" className="py-16 md:py-24">
          <div className="container grid items-center gap-8 md:grid-cols-2">
            <div className="relative order-2 md:order-1">
              <img
                src={ferritinaImage}
                alt="Prueba de Ferritina - Test de deficiencia de hierro"
                loading="lazy"
                decoding="async"
                className="mx-auto w-full max-w-md rounded-xl border shadow-[var(--shadow-elegant)]"
              />
            </div>
            <div className="order-1 space-y-4 md:order-2">
              <h2 className="text-3xl font-semibold">Prueba de Ferritina</h2>
              <p className="text-muted-foreground">
                Ideal si presentas fatiga persistente, palidez, mareos o menstruaciones abundantes. Permite evaluar tus reservas de hierro.
              </p>
              <ul className="list-disc pl-5 text-muted-foreground">
                <li>Método estandarizado de laboratorio</li>
                <li>Complemento para la evaluación de anemia</li>
                <li>Orientación para seguimiento médico</li>
              </ul>
              <div className="pt-2">
                <Button asChild variant="hero" className="w-full md:w-auto">
                  <a href="https://previta-test.pages.dev/productos/hierro" target="_blank" rel="noopener noreferrer">
                    Solicitar prueba
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:flex-row">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Salud y Bienestar</p>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#evaluacion" className="hover:text-foreground">Evaluación</a>
            <a href="#vitamina-d" className="hover:text-foreground">Vitamina D</a>
            <a href="#ferritina" className="hover:text-foreground">Ferritina</a>
          </nav>
        </div>
      </footer>
    </>
  );
};

export default Index;
