import React from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'number' | 'operator' | 'function' | 'clear' | 'memory' | 'equals';

interface CalculatorButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: ButtonVariant;
  className?: string;
  span?: number;
  disabled?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  number: 'calc-button-number',
  operator: 'calc-button-operator',
  function: 'calc-button-function',
  clear: 'calc-button-clear',
  memory: 'calc-button-memory',
  equals: 'calc-button-operator',
};

export const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  children,
  onClick,
  variant = 'number',
  className,
  span = 1,
  disabled = false,
}) => {
  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        variantClasses[variant],
        'h-14 flex items-center justify-center text-sm',
        span === 2 && 'col-span-2',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
};
