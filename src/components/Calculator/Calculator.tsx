import React, { useState } from 'react';
import { CalculatorDisplay } from './CalculatorDisplay';
import { CalculatorButton } from './CalculatorButton';
import { CalculatorHistory } from './CalculatorHistory';
import { useCalculator } from './useCalculator';
import { 
  Divide, X, Minus, Plus, Equal, Delete, 
  History, ChevronLeft, ChevronRight,
  Pi, Percent, Parentheses
} from 'lucide-react';

type NumberBase = 'DEC' | 'HEX' | 'OCT' | 'BIN';

export const Calculator: React.FC = () => {
  const [isScientific, setIsScientific] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const calc = useCalculator();

  const baseButtons: { label: string; value: NumberBase }[] = [
    { label: 'DEC', value: 'DEC' },
    { label: 'HEX', value: 'HEX' },
    { label: 'OCT', value: 'OCT' },
    { label: 'BIN', value: 'BIN' },
  ];

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-30" />
      
      <div className="glass-panel p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setIsScientific(!isScientific)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {isScientific ? (
              <>
                <ChevronLeft className="w-4 h-4" />
                Standard
              </>
            ) : (
              <>
                Scientific
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
          
          <div className="flex items-center gap-2">
            {isScientific && (
              <>
                <button
                  onClick={calc.toggleSecondFunction}
                  className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                    calc.isSecondFunction 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary/50 hover:bg-secondary text-muted-foreground'
                  }`}
                >
                  2nd
                </button>
                <button
                  onClick={calc.toggleAngleMode}
                  className="px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-sm font-medium text-primary"
                >
                  {calc.isRadians ? 'RAD' : 'DEG'}
                </button>
              </>
            )}
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            >
              <History className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Number Base Selector (Scientific mode) */}
        {isScientific && (
          <div className="flex gap-2 mb-4 animate-slide-up">
            {baseButtons.map((base) => (
              <button
                key={base.value}
                onClick={() => calc.setNumberBase(base.value)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                  calc.numberBase === base.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                }`}
              >
                {base.label}
              </button>
            ))}
          </div>
        )}

        {/* Display */}
        <CalculatorDisplay
          value={calc.display}
          expression={calc.expression}
          memory={calc.memory}
          numberBase={calc.numberBase}
        />

        {/* Memory buttons */}
        <div className="grid grid-cols-5 gap-2 mb-3">
          <CalculatorButton variant="memory" onClick={calc.memoryClear}>MC</CalculatorButton>
          <CalculatorButton variant="memory" onClick={calc.memoryRecall}>MR</CalculatorButton>
          <CalculatorButton variant="memory" onClick={calc.memoryAdd}>M+</CalculatorButton>
          <CalculatorButton variant="memory" onClick={calc.memorySubtract}>M-</CalculatorButton>
          <CalculatorButton variant="memory" onClick={calc.memoryStore}>MS</CalculatorButton>
        </div>

        {/* Scientific buttons */}
        {isScientific && (
          <div className="space-y-2 mb-3 animate-slide-up">
            {/* Constants Row */}
            <div className="grid grid-cols-7 gap-2">
              <CalculatorButton variant="function" onClick={() => calc.insertConstant('π')}>
                <Pi className="w-4 h-4" />
              </CalculatorButton>
              <CalculatorButton variant="function" onClick={() => calc.insertConstant('e')}>e</CalculatorButton>
              <CalculatorButton variant="function" onClick={() => calc.insertConstant('φ')}>φ</CalculatorButton>
              <CalculatorButton variant="function" onClick={() => calc.insertConstant('√2')}>√2</CalculatorButton>
              <CalculatorButton variant="function" onClick={calc.inputOpenParen}>(</CalculatorButton>
              <CalculatorButton variant="function" onClick={calc.inputCloseParen}>)</CalculatorButton>
              <CalculatorButton variant="function" onClick={() => calc.performScientific('rand')}>RND</CalculatorButton>
            </div>

            {/* Trig Row */}
            <div className="grid grid-cols-6 gap-2">
              {calc.isSecondFunction ? (
                <>
                  <CalculatorButton variant="function" onClick={() => calc.performScientific('asin')}>sin⁻¹</CalculatorButton>
                  <CalculatorButton variant="function" onClick={() => calc.performScientific('acos')}>cos⁻¹</CalculatorButton>
                  <CalculatorButton variant="function" onClick={() => calc.performScientific('atan')}>tan⁻¹</CalculatorButton>
                  <CalculatorButton variant="function" onClick={() => calc.performScientific('asinh')}>sinh⁻¹</CalculatorButton>
                  <CalculatorButton variant="function" onClick={() => calc.performScientific('acosh')}>cosh⁻¹</CalculatorButton>
                  <CalculatorButton variant="function" onClick={() => calc.performScientific('atanh')}>tanh⁻¹</CalculatorButton>
                </>
              ) : (
                <>
                  <CalculatorButton variant="function" onClick={() => calc.performScientific('sin')}>sin</CalculatorButton>
                  <CalculatorButton variant="function" onClick={() => calc.performScientific('cos')}>cos</CalculatorButton>
                  <CalculatorButton variant="function" onClick={() => calc.performScientific('tan')}>tan</CalculatorButton>
                  <CalculatorButton variant="function" onClick={() => calc.performScientific('sinh')}>sinh</CalculatorButton>
                  <CalculatorButton variant="function" onClick={() => calc.performScientific('cosh')}>cosh</CalculatorButton>
                  <CalculatorButton variant="function" onClick={() => calc.performScientific('tanh')}>tanh</CalculatorButton>
                </>
              )}
            </div>

            {/* Log & Power Row */}
            <div className="grid grid-cols-6 gap-2">
              {calc.isSecondFunction ? (
                <>
                  <CalculatorButton variant="function" onClick={() => calc.performScientific('10x')}>10ˣ</CalculatorButton>
                  <CalculatorButton variant="function" onClick={() => calc.performScientific('2x')}>2ˣ</CalculatorButton>
                  <CalculatorButton variant="function" onClick={() => calc.performScientific('exp')}>eˣ</CalculatorButton>
                  <CalculatorButton variant="function" onClick={() => calc.performOperation('yroot')}>ʸ√x</CalculatorButton>
                  <CalculatorButton variant="function" onClick={() => calc.performScientific('rtod')}>→°</CalculatorButton>
                  <CalculatorButton variant="function" onClick={() => calc.performScientific('dtor')}>→rad</CalculatorButton>
                </>
              ) : (
                <>
                  <CalculatorButton variant="function" onClick={() => calc.performScientific('log')}>log</CalculatorButton>
                  <CalculatorButton variant="function" onClick={() => calc.performScientific('log2')}>log₂</CalculatorButton>
                  <CalculatorButton variant="function" onClick={() => calc.performScientific('ln')}>ln</CalculatorButton>
                  <CalculatorButton variant="function" onClick={() => calc.performOperation('^')}>xʸ</CalculatorButton>
                  <CalculatorButton variant="function" onClick={() => calc.performScientific('sqrt')}>√</CalculatorButton>
                  <CalculatorButton variant="function" onClick={() => calc.performScientific('cbrt')}>∛</CalculatorButton>
                </>
              )}
            </div>

            {/* Special Functions Row */}
            <div className="grid grid-cols-6 gap-2">
              <CalculatorButton variant="function" onClick={() => calc.performScientific('x2')}>x²</CalculatorButton>
              <CalculatorButton variant="function" onClick={() => calc.performScientific('x3')}>x³</CalculatorButton>
              <CalculatorButton variant="function" onClick={() => calc.performScientific('1/x')}>1/x</CalculatorButton>
              <CalculatorButton variant="function" onClick={() => calc.performScientific('fact')}>n!</CalculatorButton>
              <CalculatorButton variant="function" onClick={() => calc.performScientific('abs')}>|x|</CalculatorButton>
              <CalculatorButton variant="function" onClick={() => calc.performOperation('mod')}>mod</CalculatorButton>
            </div>

            {/* Rounding & Combinatorics Row */}
            <div className="grid grid-cols-6 gap-2">
              <CalculatorButton variant="function" onClick={() => calc.performScientific('floor')}>⌊x⌋</CalculatorButton>
              <CalculatorButton variant="function" onClick={() => calc.performScientific('ceil')}>⌈x⌉</CalculatorButton>
              <CalculatorButton variant="function" onClick={() => calc.performScientific('round')}>rnd</CalculatorButton>
              <CalculatorButton variant="function" onClick={() => calc.performScientific('sign')}>sgn</CalculatorButton>
              <CalculatorButton variant="function" onClick={() => calc.performTwoArgScientific('nPr')}>nPr</CalculatorButton>
              <CalculatorButton variant="function" onClick={() => calc.performTwoArgScientific('nCr')}>nCr</CalculatorButton>
            </div>

            {/* Hex digits (only in HEX mode) */}
            {calc.numberBase === 'HEX' && (
              <div className="grid grid-cols-6 gap-2">
                <CalculatorButton onClick={() => calc.inputDigit('A')}>A</CalculatorButton>
                <CalculatorButton onClick={() => calc.inputDigit('B')}>B</CalculatorButton>
                <CalculatorButton onClick={() => calc.inputDigit('C')}>C</CalculatorButton>
                <CalculatorButton onClick={() => calc.inputDigit('D')}>D</CalculatorButton>
                <CalculatorButton onClick={() => calc.inputDigit('E')}>E</CalculatorButton>
                <CalculatorButton onClick={() => calc.inputDigit('F')}>F</CalculatorButton>
              </div>
            )}
          </div>
        )}

        {/* Main buttons */}
        <div className="grid grid-cols-4 gap-3">
          {/* Row 1 */}
          <CalculatorButton variant="clear" onClick={calc.clearAll}>AC</CalculatorButton>
          <CalculatorButton variant="function" onClick={calc.toggleSign}>±</CalculatorButton>
          <CalculatorButton variant="function" onClick={calc.inputPercent}>
            <Percent className="w-5 h-5" />
          </CalculatorButton>
          <CalculatorButton variant="operator" onClick={() => calc.performOperation('÷')}>
            <Divide className="w-5 h-5" />
          </CalculatorButton>

          {/* Row 2 */}
          <CalculatorButton onClick={() => calc.inputDigit('7')}>7</CalculatorButton>
          <CalculatorButton onClick={() => calc.inputDigit('8')}>8</CalculatorButton>
          <CalculatorButton onClick={() => calc.inputDigit('9')}>9</CalculatorButton>
          <CalculatorButton variant="operator" onClick={() => calc.performOperation('×')}>
            <X className="w-5 h-5" />
          </CalculatorButton>

          {/* Row 3 */}
          <CalculatorButton onClick={() => calc.inputDigit('4')}>4</CalculatorButton>
          <CalculatorButton onClick={() => calc.inputDigit('5')}>5</CalculatorButton>
          <CalculatorButton onClick={() => calc.inputDigit('6')}>6</CalculatorButton>
          <CalculatorButton variant="operator" onClick={() => calc.performOperation('-')}>
            <Minus className="w-5 h-5" />
          </CalculatorButton>

          {/* Row 4 */}
          <CalculatorButton onClick={() => calc.inputDigit('1')}>1</CalculatorButton>
          <CalculatorButton onClick={() => calc.inputDigit('2')}>2</CalculatorButton>
          <CalculatorButton onClick={() => calc.inputDigit('3')}>3</CalculatorButton>
          <CalculatorButton variant="operator" onClick={() => calc.performOperation('+')}>
            <Plus className="w-5 h-5" />
          </CalculatorButton>

          {/* Row 5 */}
          <CalculatorButton variant="function" onClick={calc.backspace}>
            <Delete className="w-5 h-5" />
          </CalculatorButton>
          <CalculatorButton onClick={() => calc.inputDigit('0')}>0</CalculatorButton>
          <CalculatorButton onClick={calc.inputDecimal}>.</CalculatorButton>
          <CalculatorButton variant="equals" onClick={calc.performEquals}>
            <Equal className="w-5 h-5" />
          </CalculatorButton>
        </div>

        {/* Keyboard hint */}
        <div className="mt-4 text-center text-xs text-muted-foreground/50">
          Keyboard supported • Use 2nd for inverse functions
        </div>

        {/* History panel */}
        {showHistory && (
          <CalculatorHistory
            history={calc.history}
            onSelect={(entry) => {
              calc.selectHistoryEntry(entry);
              setShowHistory(false);
            }}
            onClear={calc.clearHistory}
            onClose={() => setShowHistory(false)}
          />
        )}
      </div>
    </div>
  );
};
