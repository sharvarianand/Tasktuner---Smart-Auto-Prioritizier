import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Star, Flame, Brain } from "lucide-react";

export const TaskStats = ({ stats, lastPrioritized, taskCount }: { stats: any; lastPrioritized: Date | null; taskCount: number; }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <StatsCard
      title="Total Tasks"
      value={stats.totalTasks}
      icon={<CheckCircle className="h-8 w-8 text-primary" />}
    />
    <StatsCard
      title="Completed"
      value={stats.tasksCompleted}
      icon={<Star className="h-8 w-8 text-green-500" />}
    />
    <StatsCard
      title="Total XP"
      value={stats.xpEarned}
      icon={<Flame className="h-8 w-8 text-orange-500" />}
    />
    {lastPrioritized && (
      <StatsCard
        title="AI Prioritized"
        value={taskCount}
        icon={<Brain className="h-8 w-8 text-purple-500" />}
        subtitle="Advanced algorithm active"
      />}
  </div>
);

const StatsCard = ({ title, value, icon, subtitle }: { title: string; value: number; icon: React.ReactNode; subtitle?: string; }) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && <p className="text-xs text-purple-600">{subtitle}</p>}
        </div>
        {icon}
      </div>
    </CardContent>
  </Card>
);




