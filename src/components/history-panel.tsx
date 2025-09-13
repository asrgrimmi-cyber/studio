"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

type HistoryItem = {
  expression: string;
  result: number;
};

type HistoryPanelProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  history: HistoryItem[];
  memory: number;
  setMemory: (value: number) => void;
  currentValue: string;
  clearHistory: () => void;
};

export function HistoryPanel({
  isOpen,
  onOpenChange,
  history,
  memory,
  setMemory,
  currentValue,
  clearHistory,
}: HistoryPanelProps) {

  const handleMemoryOp = (op: "M+" | "M-" | "MC" | "MR") => {
    const currentNum = parseFloat(currentValue);
    if (isNaN(currentNum) && op !== "MC" && op !== "MR") return;

    switch (op) {
      case "M+":
        setMemory(memory + currentNum);
        break;
      case "M-":
        setMemory(memory - currentNum);
        break;
      case "MC":
        setMemory(0);
        break;
      case "MR":
        // This is a complex operation to inject back into the calculator state.
        // For now, we just display it. A full implementation would need a callback.
        alert(`Memory Recall: ${memory}`);
        break;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[350px] sm:w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Activity</SheetTitle>
          <SheetDescription>
            Review your calculation history and manage stored memory.
          </SheetDescription>
        </SheetHeader>
        <Tabs defaultValue="history" className="flex-grow flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="memory">Memory</TabsTrigger>
          </TabsList>
          <TabsContent value="history" className="flex-grow mt-4">
            <ScrollArea className="h-[calc(100vh-220px)] pr-4">
              {history.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>No history yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item, index) => (
                    <div key={index}>
                      <p className="text-sm text-muted-foreground truncate">{item.expression}</p>
                      <p className="text-2xl font-semibold text-right">{item.result}</p>
                      <Separator className="mt-2" />
                    </div>
                  )).reverse()}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="memory" className="flex-grow mt-4">
            <div className="flex flex-col items-center justify-center h-full space-y-4">
                <p className="text-sm text-muted-foreground">Value in Memory</p>
                <p className="text-6xl font-bold font-mono">{memory}</p>
                <div className="grid grid-cols-2 gap-4 pt-8">
                    <Button variant="outline" onClick={() => handleMemoryOp("M+")}>Memory Add (M+)</Button>
                    <Button variant="outline" onClick={() => handleMemoryOp("M-")}>Memory Subtract (M-)</Button>
                    <Button variant="outline" onClick={() => handleMemoryOp("MR")}>Memory Recall (MR)</Button>
                    <Button variant="destructive" onClick={() => handleMemoryOp("MC")}>Memory Clear (MC)</Button>
                </div>
            </div>
          </TabsContent>
        </Tabs>
        <SheetFooter>
            <Button variant="destructive" onClick={clearHistory}>Clear History</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
