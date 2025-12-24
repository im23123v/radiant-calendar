import React from 'react';
import { X, History, Trash2 } from 'lucide-react';

export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}

interface CalculatorHistoryProps {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
  onClose: () => void;
}

export const CalculatorHistory: React.FC<CalculatorHistoryProps> = ({
  history,
  onSelect,
  onClear,
  onClose,
}) => {
  return (
    <div className="absolute inset-0 glass-panel z-10 flex flex-col animate-fade-in">
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2 text-foreground">
          <History className="w-5 h-5 text-primary" />
          <span className="font-medium">History</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
            title="Clear history"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <History className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">No calculations yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((entry) => (
              <button
                key={entry.id}
                onClick={() => onSelect(entry)}
                className="w-full p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-left group"
              >
                <div className="text-sm text-muted-foreground font-mono truncate">
                  {entry.expression}
                </div>
                <div className="text-lg text-foreground font-mono font-semibold group-hover:text-primary transition-colors">
                  = {entry.result}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
