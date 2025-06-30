import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LucideLogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function LogoutButton() {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          className="p-2 border rounded-md border-red-600 text-red-400 hover:bg-red-800/20 transition hover:scale-105 active:scale-95 cursor-pointer"
        >
          <LucideLogOut className="w-5 h-5" />
        </div>
      </DialogTrigger>

      <DialogContent className="bg-[#111] border border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-red-400">Confirm Logout</DialogTitle>
        </DialogHeader>

        <p className="text-gray-300 py-2">Are you sure you want to log out?</p>

        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="text-black border-gray-600 hover:bg-gray-800 hover:text-white "
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
