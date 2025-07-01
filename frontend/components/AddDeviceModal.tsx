"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddDeviceModalProps {
  onDeviceAdded?: () => void;
}

export function AddDeviceModal({ onDeviceAdded }: AddDeviceModalProps) {
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [ip, setIp] = useState("");
  const [type, setType] = useState("PC");
  const [place, setPlace] = useState("");
  const [description, setDescription] = useState("");

  const resetForm = () => {
    setName("");
    setIp("");
    setType("PC");
    setPlace("");
    setDescription("");
  };

  const handleAddDevice = async () => {
    if (!name || !ip || !type || !place) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          name,
          ip,
          type,
          place,
          description,
          status: 0,
          last_seen: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Failed to add device");

      toast.success("Device added successfully!");
      onDeviceAdded?.(); // Callback to refresh the dashboard
      setOpen(false);
      resetForm();
    } catch (err) {
      toast.error("Error adding device.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) resetForm(); // Reset form when dialog closes
      }}
    >
      <DialogTrigger asChild>
        <motion.button
          className="p-2 border border-green-500 rounded-md hover:bg-green-900/20 transition cursor-pointer hover:scale-105 active:scale-95"
          whileTap={{ scale: 0.9 }}
          aria-label="Add Device"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="text-green-400 w-5 h-5" />
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </DialogTrigger>

      <DialogContent className="bg-[#111] border border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Add New Device</DialogTitle>
          <DialogDescription className="text-gray-400">
            Fill in the details of the new device to be added to the monitoring
            dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Device Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. IT-PC-01"
              className="bg-[#1a1a1a] border-gray-700 text-white"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ip">IP Address *</Label>
            <Input
              id="ip"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="e.g. 192.168.0.1"
              className="bg-[#1a1a1a] border-gray-700 text-white"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Device Type *</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-gray-700 text-white ">
                <SelectItem value="PC">PC</SelectItem>
                <SelectItem value="Server">Server</SelectItem>
                <SelectItem value="Gateway">Gateway</SelectItem>
                <SelectItem value="Switch">Switch</SelectItem>
                <SelectItem value="Router">Router</SelectItem>
                <SelectItem value="Printer">Printer</SelectItem>
                <SelectItem value="Scanner">Scanner</SelectItem>
                <SelectItem value="Camera">Camera</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="place">Location/Place *</Label>
            <Select value={place} onValueChange={setPlace}>
              <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white w-full">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-gray-700 text-white">
                <SelectItem value="Gate Management">Gate Management</SelectItem>
                <SelectItem value="CFS">CFS</SelectItem>
                <SelectItem value="IT Room">IT Room</SelectItem>
                <SelectItem value="Specialists Room">Specialists Room</SelectItem>
                <SelectItem value="Server Room">Server Room</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              className="bg-[#1a1a1a] border-gray-700 text-white"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            disabled={loading}
            onClick={handleAddDevice}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? "Adding..." : "Add Device"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
