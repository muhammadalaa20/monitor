"use client";

import { API_BASE_URL } from "@/lib/config";
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
import { LucideEdit } from "lucide-react";
import { motion } from "framer-motion";
interface Device {
  id: number;
  name: string;
  ip: string;
  type: string;
  place: string;
  description: string;
}
interface EditDeviceModalProps {
  device: Device;
  onUpdated?: () => void;
}

export function EditDeviceModal({ device, onUpdated }: EditDeviceModalProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(device.name);
  const [ip, setIp] = useState(device.ip);
  const [type, setType] = useState(device.type);
  const [place, setPlace] = useState(device.place);
  const [description, setDescription] = useState(device.description || "");

  const handleUpdateDevice = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/devices/${device.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            ...device,
            name,
            ip,
            type,
            place,
            description,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update device");

      toast.success("Device updated!");
      onUpdated?.();
      setOpen(false);
    } catch (err) {
      toast.error(
        "Error updating device." +
          (err instanceof Error ? `: ${err.message}` : "")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.button
          className="p-2 border border-yellow-600 text-yellow-400 rounded-md hover:bg-yellow-800/20 transition hover:scale-105 active:scale-95 cursor-pointer"
          whileTap={{ scale: 0.9 }}
        >
          <LucideEdit className="h-5 w-5" />
        </motion.button>
      </DialogTrigger>
      <DialogContent className="bg-[#111] border border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Edit Device</DialogTitle>
          <DialogDescription>
            Update the selected device info.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label>Device Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-[#1a1a1a] text-white border-gray-700 w-full"
          />
          <Label>IP</Label>
          <Input
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            className="bg-[#1a1a1a] text-white border-gray-700 w-full"
          />
          <Label>Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="bg-[#1a1a1a] text-white border-gray-700 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-gray-700 text-white">
              {[
                "PC",
                "Server",
                "Switch",
                "Router",
                "Printer",
                "Camera",
                "Access Point",
                "Other",
              ].map((val) => (
                <SelectItem key={val} value={val}>
                  {val}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Label>Place</Label>
          <Select value={place} onValueChange={setPlace}>
            <SelectTrigger className="bg-[#1a1a1a] text-white border-gray-700 w-full">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] text-white border-gray-700">
              <SelectItem value="Gate Management">Gate Management</SelectItem>
              <SelectItem value="CFS">CFS</SelectItem>
              <SelectItem value="Dangerous CFS">Dangerous CFS</SelectItem>
              <SelectItem value="IT Room">IT Room</SelectItem>
              <SelectItem value="Specialists Room">Specialists Room</SelectItem>
              <SelectItem value="Server Room">Server Room</SelectItem>
              <SelectItem value="Management Building">
                Management Building
              </SelectItem>
              <SelectItem value="New Building">New Building</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Label>Description</Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-[#1a1a1a] text-white border-gray-700 w-full"
          />
        </div>
        <DialogFooter>
          <Button
            onClick={handleUpdateDevice}
            disabled={loading}
            className="bg-yellow-600 hover:bg-yellow-700 cursor-pointer"
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
