"use client";

import { useState } from 'react';
import {
  Delete,
  History,
  Sigma,
  Plus,
  Minus,
  X,
  Divide,
  Percent,
  SquareRadical,
  ChevronUp,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { HistoryPanel } from '@/components/history-panel';
import { evaluateExpression } from '@/ai/flows/evaluate-expression';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type HistoryItem = {
  expression: string;
  result: number;
};

export function Calculator() {
  const [input, setInput] = useState('0');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [memory, setMemory] = useState(0);
  const [isHistoryOpen, setHistoryOpen] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const { toast } = useToast();

  const handleButtonClick = (value: string) => {
    if (isEvaluating) return;
    setInput((prev) => {
      if (prev.length > 40) return prev;
      if (prev === '0' || prev === 'Error') {
        return value;
      }
      return prev + value;
    });
  };

  const handleOperatorClick = (operator: string) => {
    if (isEvaluating) return;
    setInput((prev) => {
      if (prev === 'Error') return operator;
      if (['+', '-', '*', '/'].some((op) => prev.endsWith(` ${op} `))) {
        return prev.slice(0, -3) + ` ${operator} `;
      }
      return prev + ` ${operator} `;
    });
  };

  const handleEquals = async () => {
    if (isEvaluating || input === 'Error' || input === '0') return;

    setIsEvaluating(true);
    try {
      // Basic validation to prevent GenAI calls for trivial invalid inputs
      if (/\/ 0(?!\.)/.test(input)) {
        throw new Error("Division by zero is not allowed.");
      }

      const result = await evaluateExpression({ expression: input });
      setHistory((prev) => [...prev, { expression: input, result: result.result }]);
      setInput(String(result.result));
    } catch (error) {
      console.error(error);
      setInput('Error');
      toast({
        variant: "destructive",
        title: "Calculation Error",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsEvaluating(false);
    }
  };
  
  const clearInput = () => {
    setInput('0');
  };

  const allClear = () => {
    setInput('0');
    setHistory([]);
    setMemory(0);
  };

  const backspace = () => {
    if (isEvaluating) return;
    setInput((prev) => prev.length > 1 ? prev.slice(0, -1) : '0');
  };

  const handleSpecialFunction = (func: 'sqrt' | '%' | '^') => {
    if (isEvaluating) return;
    switch(func) {
        case 'sqrt':
            setInput(prev => `sqrt(${prev})`);
            break;
        case '%':
            setInput(prev => `(${prev}) / 100`);
            break;
        case '^':
            setInput(prev => `${prev}^`);
            break;
    }
  };

  const buttonClass =
    'h-16 text-2xl rounded-xl transition-transform transform active:scale-95';

  return (
    <Card className="w-full max-w-md shadow-2xl rounded-2xl border-2">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center font-headline">
          PyCalc
        </CardTitle>
        <CardDescription className="text-center">
          AI-Powered Modern Calculator
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/50 p-4 rounded-xl mb-4 shadow-inner">
          <div className="text-right text-4xl font-light font-code break-all h-16 flex items-center justify-end" aria-live="polite">
            {input}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <Button
            variant="secondary"
            className={cn(buttonClass, "text-destructive")}
            onClick={allClear}
            aria-label="All Clear"
          >
            AC
          </Button>
          <Button
            variant="secondary"
            className={buttonClass}
            onClick={backspace}
            aria-label="Backspace"
          >
            <Delete />
          </Button>
           <Button variant="secondary" className={buttonClass} onClick={() => handleSpecialFunction('%')} aria-label="Percentage">
            <Percent />
          </Button>
          <Button
            variant="ghost"
            className={cn(buttonClass, "bg-accent hover:bg-accent/80 text-accent-foreground")}
            onClick={() => handleOperatorClick('/')}
            aria-label="Divide"
          >
            <Divide />
          </Button>

          <Button variant="secondary" className={buttonClass} onClick={() => handleSpecialFunction('sqrt')} aria-label="Square Root">
            <SquareRadical />
          </Button>
          <Button variant="secondary" className={buttonClass} onClick={() => handleSpecialFunction('^')} aria-label="Exponent">
            <ChevronUp size={24} className="transform -translate-y-0.5" /><span className="sr-only">Exponent</span>
          </Button>
           <Button
            variant="secondary"
            className={buttonClass}
            onClick={() => setHistoryOpen(true)}
            aria-label="History and Memory"
          >
            <History />
          </Button>
           <Button
            variant="ghost"
            className={cn(buttonClass, "bg-accent hover:bg-accent/80 text-accent-foreground")}
            onClick={() => handleOperatorClick('*')}
            aria-label="Multiply"
          >
            <X />
          </Button>
          

          <Button variant="outline" className={buttonClass} onClick={() => handleButtonClick('7')}>7</Button>
          <Button variant="outline" className={buttonClass} onClick={() => handleButtonClick('8')}>8</Button>
          <Button variant="outline" className={buttonClass} onClick={() => handleButtonClick('9')}>9</Button>
          <Button
            variant="ghost"
            className={cn(buttonClass, "bg-accent hover:bg-accent/80 text-accent-foreground")}
            onClick={() => handleOperatorClick('-')}
            aria-label="Subtract"
          >
            <Minus />
          </Button>

          <Button variant="outline" className={buttonClass} onClick={() => handleButtonClick('4')}>4</Button>
          <Button variant="outline" className={buttonClass} onClick={() => handleButtonClick('5')}>5</Button>
          <Button variant="outline" className={buttonClass} onClick={() => handleButtonClick('6')}>6</Button>
          <Button
            variant="ghost"
            className={cn(buttonClass, "bg-accent hover:bg-accent/80 text-accent-foreground")}
            onClick={() => handleOperatorClick('+')}
            aria-label="Add"
          >
            <Plus />
          </Button>

          <Button variant="outline" className={buttonClass} onClick={() => handleButtonClick('1')}>1</Button>
          <Button variant="outline" className={buttonClass} onClick={() => handleButtonClick('2')}>2</Button>
          <Button variant="outline" className={buttonClass} onClick={() => handleButtonClick('3')}>3</Button>
          <Button
             variant="default"
            className={cn(buttonClass, 'row-span-2 bg-primary hover:bg-primary/90')}
            onClick={handleEquals}
            aria-label="Equals"
            disabled={isEvaluating}
          >
             {isEvaluating ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-foreground"></div> : <Sigma />}
          </Button>

          <Button variant="outline" className={cn(buttonClass, "col-span-2")} onClick={() => handleButtonClick('0')}>0</Button>
          <Button variant="outline" className={buttonClass} onClick={() => handleButtonClick('.')}>.</Button>
        </div>
      </CardContent>
      <HistoryPanel
        isOpen={isHistoryOpen}
        onOpenChange={setHistoryOpen}
        history={history}
        memory={memory}
        setMemory={setMemory}
        currentValue={input}
        clearHistory={() => setHistory([])}
      />
    </Card>
  );
}
