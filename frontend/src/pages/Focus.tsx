import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard-layout"
import { FocusMode } from "@/components/focus-mode"

const Focus = () => {
  return (
    <DashboardLayout title="Focus Mode">
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Enter the Zone 🎯
            </h1>
            <p className="text-lg text-muted-foreground">
              Time to stop scrolling and start focusing. Your future self will thank you.
            </p>
          </div>
          
          <FocusMode />
          
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground italic">
              "The way to get started is to quit talking and begin doing." - Walt Disney
            </p>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

export default Focus