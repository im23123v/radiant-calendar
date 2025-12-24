import { useState, useCallback, useEffect } from 'react';
import { HistoryEntry } from './CalculatorHistory';

type Operator = '+' | '-' | '×' | '÷' | '^' | 'mod' | 'yroot';
type NumberBase = 'DEC' | 'HEX' | 'OCT' | 'BIN';

interface CalculatorState {
  display: string;
  expression: string;
  previousValue: number | null;
  operator: Operator | null;
  waitingForOperand: boolean;
  memory: number | null;
  history: HistoryEntry[];
  isRadians: boolean;
  numberBase: NumberBase;
  isSecondFunction: boolean;
  parenthesesCount: number;
  expressionStack: string[];
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
  numberBase: 'DEC',
  isSecondFunction: false,
  parenthesesCount: 0,
  expressionStack: [],
};

export const useCalculator = () => {
  const [state, setState] = useState<CalculatorState>(initialState);

  const clearAll = useCallback(() => {
    setState((prev) => ({
      ...initialState,
      memory: prev.memory,
      history: prev.history,
      isRadians: prev.isRadians,
      numberBase: prev.numberBase,
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
      // For hex mode, allow A-F
      if (prev.numberBase === 'HEX' && /[A-Fa-f]/.test(digit)) {
        digit = digit.toUpperCase();
      }
      
      // Validate digit for current base
      if (prev.numberBase === 'BIN' && !/[01]/.test(digit)) return prev;
      if (prev.numberBase === 'OCT' && !/[0-7]/.test(digit)) return prev;
      if (prev.numberBase === 'DEC' && !/[0-9]/.test(digit)) return prev;
      
      if (prev.waitingForOperand) {
        return {
          ...prev,
          display: digit,
          waitingForOperand: false,
        };
      }
      
      const newDisplay = prev.display === '0' ? digit : prev.display + digit;
      if (newDisplay.replace(/[^0-9A-Fa-f]/g, '').length > 15) {
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
      if (prev.numberBase !== 'DEC') return prev; // Only allow decimals in DEC mode
      
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

  const getDecimalValue = useCallback((display: string, base: NumberBase): number => {
    switch (base) {
      case 'HEX': return parseInt(display, 16);
      case 'OCT': return parseInt(display, 8);
      case 'BIN': return parseInt(display, 2);
      default: return parseFloat(display);
    }
  }, []);

  const formatForBase = useCallback((value: number, base: NumberBase): string => {
    if (isNaN(value) || !isFinite(value)) return String(value);
    const intValue = Math.floor(value);
    switch (base) {
      case 'HEX': return intValue.toString(16).toUpperCase();
      case 'OCT': return intValue.toString(8);
      case 'BIN': return intValue.toString(2);
      default: return String(value);
    }
  }, []);

  const performOperation = useCallback((op: Operator) => {
    setState((prev) => {
      const inputValue = getDecimalValue(prev.display, prev.numberBase);
      
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
        const displayResult = formatForBase(result, prev.numberBase);
        return {
          ...prev,
          display: displayResult,
          previousValue: result,
          operator: op,
          expression: `${displayResult} ${op}`,
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
  }, [getDecimalValue, formatForBase]);

  const calculate = (a: number, b: number, op: Operator): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : NaN;
      case '^': return Math.pow(a, b);
      case 'mod': return a % b;
      case 'yroot': return Math.pow(a, 1 / b);
      default: return b;
    }
  };

  const performEquals = useCallback(() => {
    setState((prev) => {
      if (prev.operator === null || prev.previousValue === null) {
        return prev;
      }
      
      const inputValue = getDecimalValue(prev.display, prev.numberBase);
      const result = calculate(prev.previousValue, inputValue, prev.operator);
      const displayResult = formatForBase(result, prev.numberBase);
      const fullExpression = `${formatForBase(prev.previousValue, prev.numberBase)} ${prev.operator} ${prev.display}`;
      
      const newEntry: HistoryEntry = {
        id: Date.now().toString(),
        expression: fullExpression,
        result: displayResult,
        timestamp: new Date(),
      };
      
      return {
        ...prev,
        display: displayResult,
        expression: `${fullExpression} =`,
        previousValue: null,
        operator: null,
        waitingForOperand: true,
        history: [newEntry, ...prev.history].slice(0, 50),
      };
    });
  }, [getDecimalValue, formatForBase]);

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

  // Factorial helper
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

  // GCD helper
  const gcd = (a: number, b: number): number => {
    a = Math.abs(Math.floor(a));
    b = Math.abs(Math.floor(b));
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  };

  // LCM helper
  const lcm = (a: number, b: number): number => {
    return Math.abs(Math.floor(a) * Math.floor(b)) / gcd(a, b);
  };

  // Permutation
  const permutation = (n: number, r: number): number => {
    if (r > n || n < 0 || r < 0) return NaN;
    return factorial(n) / factorial(n - r);
  };

  // Combination
  const combination = (n: number, r: number): number => {
    if (r > n || n < 0 || r < 0) return NaN;
    return factorial(n) / (factorial(r) * factorial(n - r));
  };

  // Scientific functions
  const performScientific = useCallback((func: string) => {
    setState((prev) => {
      const value = getDecimalValue(prev.display, prev.numberBase);
      if (isNaN(value)) return prev;
      
      let result: number;
      const angleValue = prev.isRadians ? value : (value * Math.PI) / 180;
      
      switch (func) {
        // Trigonometric
        case 'sin': result = Math.sin(angleValue); break;
        case 'cos': result = Math.cos(angleValue); break;
        case 'tan': result = Math.tan(angleValue); break;
        case 'asin': result = prev.isRadians ? Math.asin(value) : (Math.asin(value) * 180) / Math.PI; break;
        case 'acos': result = prev.isRadians ? Math.acos(value) : (Math.acos(value) * 180) / Math.PI; break;
        case 'atan': result = prev.isRadians ? Math.atan(value) : (Math.atan(value) * 180) / Math.PI; break;
        
        // Hyperbolic
        case 'sinh': result = Math.sinh(value); break;
        case 'cosh': result = Math.cosh(value); break;
        case 'tanh': result = Math.tanh(value); break;
        case 'asinh': result = Math.asinh(value); break;
        case 'acosh': result = Math.acosh(value); break;
        case 'atanh': result = Math.atanh(value); break;
        
        // Logarithmic
        case 'log': result = Math.log10(value); break;
        case 'ln': result = Math.log(value); break;
        case 'log2': result = Math.log2(value); break;
        
        // Powers and roots
        case 'sqrt': result = Math.sqrt(value); break;
        case 'cbrt': result = Math.cbrt(value); break;
        case 'x2': result = value * value; break;
        case 'x3': result = value * value * value; break;
        case '1/x': result = 1 / value; break;
        case 'exp': result = Math.exp(value); break;
        case '10x': result = Math.pow(10, value); break;
        case '2x': result = Math.pow(2, value); break;
        
        // Special functions
        case 'fact': result = factorial(Math.floor(value)); break;
        case 'abs': result = Math.abs(value); break;
        case 'floor': result = Math.floor(value); break;
        case 'ceil': result = Math.ceil(value); break;
        case 'round': result = Math.round(value); break;
        case 'sign': result = Math.sign(value); break;
        case 'rand': result = Math.random(); break;
        case 'dtor': result = (value * Math.PI) / 180; break;
        case 'rtod': result = (value * 180) / Math.PI; break;
        
        default: result = value;
      }
      
      const displayResult = formatForBase(result, prev.numberBase);
      return {
        ...prev,
        display: displayResult,
        expression: `${func}(${prev.display})`,
        waitingForOperand: true,
      };
    });
  }, [getDecimalValue, formatForBase]);

  // Two-argument scientific functions
  const performTwoArgScientific = useCallback((func: string) => {
    setState((prev) => {
      const value = getDecimalValue(prev.display, prev.numberBase);
      if (isNaN(value)) return prev;
      
      return {
        ...prev,
        previousValue: value,
        operator: func as Operator,
        expression: `${func}(${prev.display},`,
        waitingForOperand: true,
      };
    });
  }, [getDecimalValue]);

  const performTwoArgEquals = useCallback((func: string) => {
    setState((prev) => {
      if (prev.previousValue === null) return prev;
      
      const value = getDecimalValue(prev.display, prev.numberBase);
      let result: number;
      
      switch (func) {
        case 'gcd': result = gcd(prev.previousValue, value); break;
        case 'lcm': result = lcm(prev.previousValue, value); break;
        case 'nPr': result = permutation(prev.previousValue, value); break;
        case 'nCr': result = combination(prev.previousValue, value); break;
        default: result = value;
      }
      
      const displayResult = formatForBase(result, prev.numberBase);
      return {
        ...prev,
        display: displayResult,
        expression: `${func}(${formatForBase(prev.previousValue, prev.numberBase)}, ${prev.display}) =`,
        previousValue: null,
        operator: null,
        waitingForOperand: true,
      };
    });
  }, [getDecimalValue, formatForBase]);

  const insertConstant = useCallback((constant: string) => {
    setState((prev) => {
      let value: number;
      switch (constant) {
        case 'π': value = Math.PI; break;
        case 'e': value = Math.E; break;
        case 'φ': value = (1 + Math.sqrt(5)) / 2; break; // Golden ratio
        case 'γ': value = 0.5772156649015329; break; // Euler-Mascheroni
        case '√2': value = Math.SQRT2; break;
        case 'ln2': value = Math.LN2; break;
        case 'ln10': value = Math.LN10; break;
        default: return prev;
      }
      
      const displayResult = formatForBase(value, prev.numberBase);
      return {
        ...prev,
        display: displayResult,
        waitingForOperand: true,
      };
    });
  }, [formatForBase]);

  const toggleAngleMode = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isRadians: !prev.isRadians,
    }));
  }, []);

  const setNumberBase = useCallback((base: NumberBase) => {
    setState((prev) => {
      const decimalValue = getDecimalValue(prev.display, prev.numberBase);
      const newDisplay = formatForBase(decimalValue, base);
      return {
        ...prev,
        numberBase: base,
        display: newDisplay,
      };
    });
  }, [getDecimalValue, formatForBase]);

  const toggleSecondFunction = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isSecondFunction: !prev.isSecondFunction,
    }));
  }, []);

  // Memory functions
  const memoryClear = useCallback(() => {
    setState((prev) => ({ ...prev, memory: null }));
  }, []);

  const memoryRecall = useCallback(() => {
    setState((prev) => {
      if (prev.memory === null) return prev;
      const displayResult = formatForBase(prev.memory, prev.numberBase);
      return {
        ...prev,
        display: displayResult,
        waitingForOperand: true,
      };
    });
  }, [formatForBase]);

  const memoryAdd = useCallback(() => {
    setState((prev) => {
      const value = getDecimalValue(prev.display, prev.numberBase);
      if (isNaN(value)) return prev;
      return {
        ...prev,
        memory: (prev.memory || 0) + value,
        waitingForOperand: true,
      };
    });
  }, [getDecimalValue]);

  const memorySubtract = useCallback(() => {
    setState((prev) => {
      const value = getDecimalValue(prev.display, prev.numberBase);
      if (isNaN(value)) return prev;
      return {
        ...prev,
        memory: (prev.memory || 0) - value,
        waitingForOperand: true,
      };
    });
  }, [getDecimalValue]);

  const memoryStore = useCallback(() => {
    setState((prev) => {
      const value = getDecimalValue(prev.display, prev.numberBase);
      if (isNaN(value)) return prev;
      return {
        ...prev,
        memory: value,
        waitingForOperand: true,
      };
    });
  }, [getDecimalValue]);

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

  // Parentheses support
  const inputOpenParen = useCallback(() => {
    setState((prev) => ({
      ...prev,
      expressionStack: [...prev.expressionStack, prev.display],
      display: '0',
      parenthesesCount: prev.parenthesesCount + 1,
      expression: prev.expression + '(',
      waitingForOperand: true,
    }));
  }, []);

  const inputCloseParen = useCallback(() => {
    setState((prev) => {
      if (prev.parenthesesCount <= 0) return prev;
      
      return {
        ...prev,
        parenthesesCount: prev.parenthesesCount - 1,
        expression: prev.expression + prev.display + ')',
      };
    });
  }, []);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        inputDigit(e.key);
      } else if (e.key >= 'a' && e.key <= 'f') {
        inputDigit(e.key.toUpperCase());
      } else if (e.key >= 'A' && e.key <= 'F') {
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
      } else if (e.key === '(') {
        inputOpenParen();
      } else if (e.key === ')') {
        inputCloseParen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputDigit, inputDecimal, performOperation, inputPercent, performEquals, backspace, clearAll, clearEntry, inputOpenParen, inputCloseParen]);

  return {
    display: state.display,
    expression: state.expression,
    memory: state.memory,
    history: state.history,
    isRadians: state.isRadians,
    numberBase: state.numberBase,
    isSecondFunction: state.isSecondFunction,
    parenthesesCount: state.parenthesesCount,
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
    performTwoArgScientific,
    performTwoArgEquals,
    insertConstant,
    toggleAngleMode,
    setNumberBase,
    toggleSecondFunction,
    memoryClear,
    memoryRecall,
    memoryAdd,
    memorySubtract,
    memoryStore,
    selectHistoryEntry,
    clearHistory,
    inputOpenParen,
    inputCloseParen,
  };
};
