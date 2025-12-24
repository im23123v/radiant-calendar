import { useState, useCallback, useEffect } from 'react';
import { HistoryEntry } from './CalculatorHistory';

type Operator = '+' | '-' | '×' | '÷' | '^' | 'mod';

interface CalculatorState {
  display: string;
  expression: string;
  previousValue: number | null;
  operator: Operator | null;
  waitingForOperand: boolean;
  memory: number | null;
  history: HistoryEntry[];
  isRadians: boolean;
}

const initialState: CalculatorState = {
  display: '0',
  expression: '',
  previousValue: null,
  operator: null,
  waitingForOperand: false,
  memory: null,
  history: [],
  isRadians: true,
};

export const useCalculator = () => {
  const [state, setState] = useState<CalculatorState>(initialState);

  const clearAll = useCallback(() => {
    setState((prev) => ({
      ...initialState,
      memory: prev.memory,
      history: prev.history,
      isRadians: prev.isRadians,
    }));
  }, []);

  const clearEntry = useCallback(() => {
    setState((prev) => ({
      ...prev,
      display: '0',
      waitingForOperand: false,
    }));
  }, []);

  const inputDigit = useCallback((digit: string) => {
    setState((prev) => {
      if (prev.waitingForOperand) {
        return {
          ...prev,
          display: digit,
          waitingForOperand: false,
        };
      }
      
      const newDisplay = prev.display === '0' ? digit : prev.display + digit;
      if (newDisplay.replace(/[^0-9]/g, '').length > 15) {
        return prev;
      }
      
      return {
        ...prev,
        display: newDisplay,
      };
    });
  }, []);

  const inputDecimal = useCallback(() => {
    setState((prev) => {
      if (prev.waitingForOperand) {
        return {
          ...prev,
          display: '0.',
          waitingForOperand: false,
        };
      }
      
      if (prev.display.includes('.')) {
        return prev;
      }
      
      return {
        ...prev,
        display: prev.display + '.',
      };
    });
  }, []);

  const toggleSign = useCallback(() => {
    setState((prev) => ({
      ...prev,
      display: prev.display.startsWith('-') 
        ? prev.display.slice(1) 
        : '-' + prev.display,
    }));
  }, []);

  const inputPercent = useCallback(() => {
    setState((prev) => {
      const value = parseFloat(prev.display);
      if (isNaN(value)) return prev;
      
      const newValue = value / 100;
      return {
        ...prev,
        display: String(newValue),
        waitingForOperand: true,
      };
    });
  }, []);

  const performOperation = useCallback((op: Operator) => {
    setState((prev) => {
      const inputValue = parseFloat(prev.display);
      
      if (prev.previousValue === null) {
        return {
          ...prev,
          previousValue: inputValue,
          operator: op,
          expression: `${prev.display} ${op}`,
          waitingForOperand: true,
        };
      }
      
      if (prev.operator && !prev.waitingForOperand) {
        const result = calculate(prev.previousValue, inputValue, prev.operator);
        return {
          ...prev,
          display: String(result),
          previousValue: result,
          operator: op,
          expression: `${result} ${op}`,
          waitingForOperand: true,
        };
      }
      
      return {
        ...prev,
        operator: op,
        expression: `${prev.display} ${op}`,
        waitingForOperand: true,
      };
    });
  }, []);

  const calculate = (a: number, b: number, op: Operator): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : NaN;
      case '^': return Math.pow(a, b);
      case 'mod': return a % b;
      default: return b;
    }
  };

  const performEquals = useCallback(() => {
    setState((prev) => {
      if (prev.operator === null || prev.previousValue === null) {
        return prev;
      }
      
      const inputValue = parseFloat(prev.display);
      const result = calculate(prev.previousValue, inputValue, prev.operator);
      const fullExpression = `${prev.previousValue} ${prev.operator} ${inputValue}`;
      
      const newEntry: HistoryEntry = {
        id: Date.now().toString(),
        expression: fullExpression,
        result: String(result),
        timestamp: new Date(),
      };
      
      return {
        ...prev,
        display: String(result),
        expression: `${fullExpression} =`,
        previousValue: null,
        operator: null,
        waitingForOperand: true,
        history: [newEntry, ...prev.history].slice(0, 50),
      };
    });
  }, []);

  const backspace = useCallback(() => {
    setState((prev) => {
      if (prev.waitingForOperand) return prev;
      
      const newDisplay = prev.display.length > 1 
        ? prev.display.slice(0, -1) 
        : '0';
      
      return {
        ...prev,
        display: newDisplay,
      };
    });
  }, []);

  // Scientific functions
  const performScientific = useCallback((func: string) => {
    setState((prev) => {
      const value = parseFloat(prev.display);
      if (isNaN(value)) return prev;
      
      let result: number;
      const angleValue = prev.isRadians ? value : (value * Math.PI) / 180;
      
      switch (func) {
        case 'sin': result = Math.sin(angleValue); break;
        case 'cos': result = Math.cos(angleValue); break;
        case 'tan': result = Math.tan(angleValue); break;
        case 'asin': result = prev.isRadians ? Math.asin(value) : (Math.asin(value) * 180) / Math.PI; break;
        case 'acos': result = prev.isRadians ? Math.acos(value) : (Math.acos(value) * 180) / Math.PI; break;
        case 'atan': result = prev.isRadians ? Math.atan(value) : (Math.atan(value) * 180) / Math.PI; break;
        case 'log': result = Math.log10(value); break;
        case 'ln': result = Math.log(value); break;
        case 'sqrt': result = Math.sqrt(value); break;
        case 'cbrt': result = Math.cbrt(value); break;
        case 'x2': result = value * value; break;
        case 'x3': result = value * value * value; break;
        case '1/x': result = 1 / value; break;
        case 'exp': result = Math.exp(value); break;
        case '10x': result = Math.pow(10, value); break;
        case 'fact': result = factorial(Math.floor(value)); break;
        case 'abs': result = Math.abs(value); break;
        default: result = value;
      }
      
      return {
        ...prev,
        display: String(result),
        expression: `${func}(${value})`,
        waitingForOperand: true,
      };
    });
  }, []);

  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    if (n > 170) return Infinity;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const insertConstant = useCallback((constant: string) => {
    setState((prev) => {
      let value: number;
      switch (constant) {
        case 'π': value = Math.PI; break;
        case 'e': value = Math.E; break;
        default: return prev;
      }
      
      return {
        ...prev,
        display: String(value),
        waitingForOperand: true,
      };
    });
  }, []);

  const toggleAngleMode = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isRadians: !prev.isRadians,
    }));
  }, []);

  // Memory functions
  const memoryClear = useCallback(() => {
    setState((prev) => ({ ...prev, memory: null }));
  }, []);

  const memoryRecall = useCallback(() => {
    setState((prev) => {
      if (prev.memory === null) return prev;
      return {
        ...prev,
        display: String(prev.memory),
        waitingForOperand: true,
      };
    });
  }, []);

  const memoryAdd = useCallback(() => {
    setState((prev) => {
      const value = parseFloat(prev.display);
      if (isNaN(value)) return prev;
      return {
        ...prev,
        memory: (prev.memory || 0) + value,
        waitingForOperand: true,
      };
    });
  }, []);

  const memorySubtract = useCallback(() => {
    setState((prev) => {
      const value = parseFloat(prev.display);
      if (isNaN(value)) return prev;
      return {
        ...prev,
        memory: (prev.memory || 0) - value,
        waitingForOperand: true,
      };
    });
  }, []);

  const memoryStore = useCallback(() => {
    setState((prev) => {
      const value = parseFloat(prev.display);
      if (isNaN(value)) return prev;
      return {
        ...prev,
        memory: value,
        waitingForOperand: true,
      };
    });
  }, []);

  const selectHistoryEntry = useCallback((entry: HistoryEntry) => {
    setState((prev) => ({
      ...prev,
      display: entry.result,
      expression: '',
      previousValue: null,
      operator: null,
      waitingForOperand: true,
    }));
  }, []);

  const clearHistory = useCallback(() => {
    setState((prev) => ({ ...prev, history: [] }));
  }, []);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        inputDigit(e.key);
      } else if (e.key === '.') {
        inputDecimal();
      } else if (e.key === '+') {
        performOperation('+');
      } else if (e.key === '-') {
        performOperation('-');
      } else if (e.key === '*') {
        performOperation('×');
      } else if (e.key === '/') {
        e.preventDefault();
        performOperation('÷');
      } else if (e.key === '^') {
        performOperation('^');
      } else if (e.key === '%') {
        inputPercent();
      } else if (e.key === 'Enter' || e.key === '=') {
        performEquals();
      } else if (e.key === 'Backspace') {
        backspace();
      } else if (e.key === 'Escape') {
        clearAll();
      } else if (e.key === 'Delete') {
        clearEntry();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputDigit, inputDecimal, performOperation, inputPercent, performEquals, backspace, clearAll, clearEntry]);

  return {
    display: state.display,
    expression: state.expression,
    memory: state.memory,
    history: state.history,
    isRadians: state.isRadians,
    clearAll,
    clearEntry,
    inputDigit,
    inputDecimal,
    toggleSign,
    inputPercent,
    performOperation,
    performEquals,
    backspace,
    performScientific,
    insertConstant,
    toggleAngleMode,
    memoryClear,
    memoryRecall,
    memoryAdd,
    memorySubtract,
    memoryStore,
    selectHistoryEntry,
    clearHistory,
  };
};
