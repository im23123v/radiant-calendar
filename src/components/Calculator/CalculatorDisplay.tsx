import React from 'react';
import { cn } from '@/lib/utils';

type NumberBase = 'DEC' | 'HEX' | 'OCT' | 'BIN';

interface CalculatorDisplayProps {
  value: string;
  expression: string;
  memory: number | null;
  numberBase?: NumberBase;
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  value,
  expression,
  memory,
  numberBase = 'DEC',
}) => {
  const formatDisplay = (val: string) => {
    if (val.length > 14) {
      const num = parseFloat(val);
      if (!isNaN(num) && numberBase === 'DEC') {
        if (Math.abs(num) >= 1e10 || (Math.abs(num) < 1e-6 && num !== 0)) {
          return num.toExponential(6);
        }
        return num.toPrecision(10);
      }
    }
    return val;
  };

  const displayValue = formatDisplay(value);
  const fontSize = displayValue.length > 12 ? 'text-2xl' : displayValue.length > 10 ? 'text-3xl' : displayValue.length > 8 ? 'text-4xl' : 'text-5xl';

  const baseLabel = {
    DEC: 'Decimal',
    HEX: 'Hexadecimal',
    OCT: 'Octal',
    BIN: 'Binary',
  };

  return (
    <div className="calc-display mb-4 relative overflow-hidden">
      {/* Status indicators */}
      <div className="flex items-center gap-2 mb-2">
        {memory !== null && (
          <div className="text-xs text-primary font-medium px-2 py-1 bg-primary/10 rounded-md">
            M
          </div>
        )}
        {numberBase !== 'DEC' && (
          <div className="text-xs text-accent font-medium px-2 py-1 bg-accent/10 rounded-md">
            {numberBase}
          </div>
        )}
      </div>
      
      {/* Expression */}
      <div className="text-muted-foreground text-sm h-6 overflow-hidden text-ellipsis whitespace-nowrap mb-2">
        {expression || '\u00A0'}
      </div>
      
      {/* Main value */}
      <div
        className={cn(
          'font-mono font-semibold text-foreground transition-all duration-200 animate-fade-in',
          fontSize
        )}
      >
        {displayValue}
      </div>

      {/* Base conversion preview (when in non-DEC mode) */}
      {numberBase !== 'DEC' && (
        <div className="mt-2 pt-2 border-t border-border/30 text-xs text-muted-foreground font-mono">
          = {parseInt(value, { DEC: 10, HEX: 16, OCT: 8, BIN: 2 }[numberBase]) || 0} (decimal)
        </div>
      )}
    </div>
  );
};
