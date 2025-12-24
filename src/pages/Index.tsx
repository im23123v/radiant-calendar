import { Calculator } from '@/components/Calculator';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="text-center mb-8 relative z-10">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          <span className="text-gradient">Advanced</span> Calculator
        </h1>
        <p className="text-muted-foreground">
          Scientific calculations made beautiful
        </p>
      </header>

      {/* Calculator */}
      <main className="relative z-10 w-full">
        <Calculator />
      </main>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-muted-foreground/50 relative z-10">
        <p>Press keys to calculate • Switch to Scientific for advanced functions</p>
      </footer>
    </div>
  );
};

export default Index;
