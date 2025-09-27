import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export const EditTaskDialog = ({ isOpen, task, onClose, onSave }: { isOpen: boolean; task: any; onClose: () => void; onSave: (id: string, updates: any) => Promise<any>; }) => {
  const [title, setTitle] = useState("");

  useEffect(() => {
    setTitle(task?.title || "");
  }, [task]);

  if (!task) return null;

  const submit = async () => {
    await onSave(task.id, { title });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <div className="space-y-3">
          <Input placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={submit}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


