"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Phone, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmergencyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const helplines = [
    { name: "Vandrevala Foundation", phone: "9999666555", info: "24/7, for mental health distress" },
    { name: "AASRA", phone: "9820466726", info: "24/7, for suicidal thoughts and emotional distress" },
    { name: "iCall", phone: "9152987821", info: "Mon-Sat, 10am-8pm, psychosocial support" },
    { name: "Sneha Foundation", phone: "044-24640050", info: "24/7, suicide prevention" },
    { name: "NIMHANS", phone: "080-46110007", info: "24/7, mental health support" },
];

export function EmergencyModal({ open, onOpenChange }: EmergencyModalProps) {
  const { toast } = useToast();

  const findHelpNearby = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        window.open(`https://www.google.com/maps/search/mental+health+clinic+near+me/@${latitude},${longitude},15z`, "_blank");
      }, () => {
        toast({
          variant: "destructive",
          title: "Location Error",
          description: "Unable to retrieve your location. Please enable location services in your browser.",
        });
      });
    } else {
      toast({
          variant: "destructive",
          title: "Unsupported Browser",
          description: "Geolocation is not supported by this browser.",
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-destructive">Emergency Support</DialogTitle>
          <DialogDescription>
            If you are in immediate danger, please reach out. You are not alone.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="font-semibold">If this is a life-threatening emergency, please call your local emergency number immediately.</p>
          
          <Button onClick={findHelpNearby} className="w-full">
            <Globe className="mr-2 h-4 w-4" /> Find Emergency Help Nearby
          </Button>

          <h3 className="font-bold text-lg mt-4">Indian Helplines</h3>
          <ul className="space-y-3">
            {helplines.map((helpline) => (
              <li key={helpline.name} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-secondary rounded-lg">
                <div>
                  <p className="font-semibold">{helpline.name}</p>
                  <p className="text-sm text-muted-foreground">{helpline.info}</p>
                </div>
                <a href={`tel:${helpline.phone}`} className="mt-2 sm:mt-0">
                  <Button variant="outline">
                    <Phone className="mr-2 h-4 w-4" /> {helpline.phone}
                  </Button>
                </a>
              </li>
            ))}
          </ul>

          <h3 className="font-bold text-lg mt-4">International Helplines</h3>
          <p className="text-sm text-muted-foreground">You can find a comprehensive list of international helplines at <a href="https://findahelpline.com/" target="_blank" rel="noopener noreferrer" className="underline text-primary">Find A Helpline</a>.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
