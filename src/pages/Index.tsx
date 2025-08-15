import { Button } from "@/components/ui/button";
import HealthDecisionWizard from "@/components/health/HealthDecisionWizard";
import heroImage from "@/assets/hero-medical.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Floating Navbar */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-full px-6 py-3 shadow-lg border border-white/20">
          <div className="flex items-center space-x-6 text-white">
            <div className="flex items-center space-x-4">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="h-8 w-8"
              />
              <span className="font-semibold text-lg">PrevitaCare</span>
            </div>
            <div className="hidden md:flex items-center space-x-4 text-sm">
              <a href="#inicio" className="hover:text-blue-200 transition-colors">Inicio</a>
              <a href="#servicios" className="hover:text-blue-200 transition-colors">Servicios</a>
              <a href="#nosotros" className="hover:text-blue-200 transition-colors">Nosotros</a>
              <a href="#contacto" className="hover:text-blue-200 transition-colors">Contacto</a>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-white text-blue-700 hover:bg-blue-50 text-xs px-4 py-2"
            >
              Agendar Cita
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
                Descubre qué examen necesitas
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
                Responde nuestro cuestionario inteligente y obtén una recomendación personalizada sobre qué examen médico necesitas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto">
                  Comenzar Cuestionario
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg w-full sm:w-auto">
                  Ver Servicios
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt="Profesional médico"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Health Decision Wizard Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Cuestionario de Evaluación
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nuestro sistema inteligente analizará sus síntomas y le recomendará el examen más apropiado para su situación.
            </p>
          </div>
          <HealthDecisionWizard />
        </div>
      </section>
    </div>
  );
};

export default Index;
