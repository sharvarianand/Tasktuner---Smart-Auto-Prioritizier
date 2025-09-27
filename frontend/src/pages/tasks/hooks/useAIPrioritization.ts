import { useEffect, useState } from "react";
import { taskApi } from "@/lib/api";
import { toast } from "sonner";

export const useAIPrioritization = (tasks: any[], reloadTasks: () => Promise<void>) => {
  const [isAIMode, setIsAIMode] = useState<boolean>(true);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [prioritizedTasks, setPrioritizedTasks] = useState<any[]>([]);
  const [isReprioritizing, setIsReprioritizing] = useState<boolean>(false);
  const [lastReprioritized, setLastReprioritized] = useState<Date | null>(null);

  useEffect(() => {
    if (isAIMode && tasks.length > 0) {
      loadPrioritizedTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAIMode]);

  const loadPrioritizedTasks = async () => {
    try {
      const data = await taskApi.getPrioritizedTasks();
      setPrioritizedTasks(data.prioritizedTasks);
      setAiAnalysis(data.insights);
      setLastReprioritized(new Date());
    } catch (error) {
      console.error("Failed to load prioritized tasks:", error);
    }
  };

  const reprioritizeTasks = async () => {
    if (tasks.length < 2) {
      toast.error("Need at least 2 tasks for AI prioritization");
      return;
    }

    try {
      setIsReprioritizing(true);
      const data = await taskApi.reprioritizeTasks();
      setPrioritizedTasks(data.prioritizedTasks);
      setAiAnalysis(data.insights);
      setLastReprioritized(new Date());
      toast.success("🧠 AI has reprioritized your tasks!");
      await reloadTasks();
    } catch (error) {
      toast.error("Failed to reprioritize tasks");
    } finally {
      setIsReprioritizing(false);
    }
  };

  return {
    isAIMode,
    setIsAIMode,
    aiAnalysis,
    prioritizedTasks,
    isReprioritizing,
    lastReprioritized,
    reprioritizeTasks,
  };
};



