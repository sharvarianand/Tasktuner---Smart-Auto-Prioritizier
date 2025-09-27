import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle } from "lucide-react";
import { isTaskOverdue, getTaskCardClass } from "../utils/taskHelpers";

export const TaskList = ({ tasks, isAIMode, onToggle, onEdit, onDelete }: any) => {
  if (!tasks || tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {tasks.map((task: any, index: number) => (
        <TaskCard
          key={task.id}
          task={task}
          index={index}
          isAIMode={isAIMode}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

const TaskCard = ({ task, index, isAIMode, onToggle, onEdit, onDelete }: any) => {
  const overdue = isTaskOverdue(task);
  const isTop = isAIMode && index === 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
      <Card className={getTaskCardClass(task, overdue, isAIMode, index)}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" onClick={() => onToggle(task.id)} className="mt-1 flex-shrink-0">
              {task.completed ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium">{task.title}</h3>
                {isTop && !task.completed && (
                  <span className="text-xs text-purple-600">Top priority</span>
                )}
              </div>

              {task.description && (
                <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
              )}

              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => onEdit(task)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(task.id)}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const EmptyState = () => (
  <div className="text-center text-sm text-muted-foreground py-8">No tasks yet. Add your first task to get started!</div>
);




