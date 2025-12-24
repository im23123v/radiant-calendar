import { Calculator } from '@/components/Calculator';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Header */}
      <header className="text-center mb-8 relative z-10">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          <span className="text-gradient">Scientific</span> Calculator
        </h1>
        <p className="text-muted-foreground max-w-md">
          Advanced calculations with trigonometry, logarithms, base conversions & more
        </p>
      </header>

      {/* Calculator */}
      <main className="relative z-10 w-full">
        <Calculator />
      </main>

      {/* Features list */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-lg text-center relative z-10">
        <div className="p-3 rounded-xl bg-card/30 backdrop-blur-sm border border-border/30">
          <div className="text-primary font-semibold text-sm">Trig</div>
          <div className="text-xs text-muted-foreground">sin, cos, tan</div>
        </div>
        <div className="p-3 rounded-xl bg-card/30 backdrop-blur-sm border border-border/30">
          <div className="text-primary font-semibold text-sm">Base Conv</div>
          <div className="text-xs text-muted-foreground">DEC, HEX, OCT, BIN</div>
        </div>
        <div className="p-3 rounded-xl bg-card/30 backdrop-blur-sm border border-border/30">
          <div className="text-primary font-semibold text-sm">Memory</div>
          <div className="text-xs text-muted-foreground">MC, MR, M+, M-</div>
        </div>
        <div className="p-3 rounded-xl bg-card/30 backdrop-blur-sm border border-border/30">
          <div className="text-primary font-semibold text-sm">History</div>
          <div className="text-xs text-muted-foreground">Past calculations</div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-muted-foreground/50 relative z-10">
        <p>Full keyboard support • Press 2nd for inverse functions • Switch modes for more features</p>
      </footer>
    </div>
  );
};

export default Index;
