import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LucideTrash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

interface DeleteDeviceModalProps {
  deviceId: number;
  onDeleted?: () => void;
}

export function DeleteDeviceModal({ deviceId, onDeleted }: DeleteDeviceModalProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/devices/${deviceId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Device deleted.");
      onDeleted?.();
      setOpen(false);
    } catch (err) {
      toast.error("Error deleting device." + (err instanceof Error ? `: ${err.message}` : ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.button
          className="p-2 border border-red-600 text-red-400 rounded-md hover:bg-red-800/20 transition hover:scale-105 active:scale-95 cursor-pointer"
          whileTap={{ scale: 0.9 }}
        >
          <LucideTrash2 className="h-5 w-5" />
        </motion.button>
      </DialogTrigger>
      <DialogContent className="bg-[#111] border border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Delete Device</DialogTitle>
          <DialogDescription>Are you sure you want to delete this device?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button  onClick={() => setOpen(false)} className="bg-gray-700 hover:bg-gray-800 cursor-pointer">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
