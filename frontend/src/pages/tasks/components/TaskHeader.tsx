import { motion } from "framer-motion";
import { CheckSquare } from "lucide-react";

export const TaskHeader = ({ userName, isDemo, taskCount }: { userName: string; isDemo: boolean; taskCount: number; }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 border"
  >
    <div className="flex items-center space-x-3">
      <CheckSquare className="h-6 w-6 text-primary" />
      <div>
        <h2 className="text-lg font-semibold">
          {isDemo ? "Demo Task Management" : `${userName}'s Task Hub`}
        </h2>
        <p className="text-sm text-muted-foreground">
          {taskCount > 0
            ? `You have ${taskCount} active tasks. Time to get things done!`
            : "Ready to tackle your goals? Add your first task!"}
        </p>
      </div>
    </div>
  </motion.div>
);




