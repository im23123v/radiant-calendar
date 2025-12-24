import React from 'react';
import { cn } from '@/lib/utils';

interface CalculatorDisplayProps {
  value: string;
  expression: string;
  memory: number | null;
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  value,
  expression,
  memory,
}) => {
  const formatDisplay = (val: string) => {
    if (val.length > 12) {
      const num = parseFloat(val);
      if (!isNaN(num)) {
        if (Math.abs(num) >= 1e10 || (Math.abs(num) < 1e-6 && num !== 0)) {
          return num.toExponential(6);
        }
        return num.toPrecision(10);
      }
    }
    return val;
  };

  const displayValue = formatDisplay(value);
  const fontSize = displayValue.length > 10 ? 'text-3xl' : displayValue.length > 8 ? 'text-4xl' : 'text-5xl';

  return (
    <div className="calc-display mb-4 relative overflow-hidden">
      {/* Memory indicator */}
      {memory !== null && (
        <div className="absolute top-2 left-2 text-xs text-primary font-medium px-2 py-1 bg-primary/10 rounded-md">
          M
        </div>
      )}
      
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
    </div>
  );
};
