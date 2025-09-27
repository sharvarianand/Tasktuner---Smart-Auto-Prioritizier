import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const AIDashboard = ({
  isAIMode,
  setIsAIMode,
  aiAnalysis,
  lastReprioritized,
  isReprioritizing,
  onReprioritize,
}: {
  isAIMode: boolean;
  setIsAIMode: (v: boolean) => void;
  aiAnalysis: any;
  lastReprioritized: Date | null;
  isReprioritizing: boolean;
  onReprioritize: () => void;
}) => {
  return (
    <Card>
      <CardContent className="pt-6 flex items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          <div>AI Mode: <span className="font-medium">{isAIMode ? "On" : "Off"}</span></div>
          {lastReprioritized && (
            <div>Last reprioritized: {lastReprioritized.toLocaleTimeString()}</div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setIsAIMode(!isAIMode)}>
            {isAIMode ? "Disable AI" : "Enable AI"}
          </Button>
          <Button onClick={onReprioritize} disabled={isReprioritizing}>
            {isReprioritizing ? "Reprioritizing..." : "Reprioritize"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};





