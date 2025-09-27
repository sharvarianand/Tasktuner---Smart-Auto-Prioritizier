import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const AddTaskDialog = ({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: (t: any) => Promise<any>; }) => {
  const [title, setTitle] = useState("");

  const submit = async () => {
    if (!title.trim()) return;
    await onAdd({ title, priority: "Medium", category: "Personal", completed: false });
    setTitle("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <div className="space-y-3">
          <Input placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={submit}>Add</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};





