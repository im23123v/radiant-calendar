import React from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'number' | 'operator' | 'function' | 'clear' | 'memory' | 'equals';

interface CalculatorButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: ButtonVariant;
  className?: string;
  span?: number;
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
}) => {
  const handleClick = () => {
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        variantClasses[variant],
        'h-16 flex items-center justify-center',
        span === 2 && 'col-span-2',
        className
      )}
    >
      {children}
    </button>
  );
};
