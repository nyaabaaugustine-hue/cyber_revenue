import { useState, useEffect } from "react";
import {
  IcnMapPin as MapPin,
  IcnCheckCircle as CheckCircle,
  IcnWarning as AlertTriangle,
  IcnShield as Shield,
} from "@/components/ui/Icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface GpsPermissionDialogProps {
  open: boolean;
  onGranted: () => void;
  onDenied: () => void;
}

export function GpsPermissionDialog({
  open,
  onGranted,
  onDenied,
}: GpsPermissionDialogProps) {
  const [status, setStatus] = useState<"requesting" | "granted" | "denied">(
    "requesting"
  );

  useEffect(() => {
    if (!open) return;

    if (!navigator.geolocation) {
      setStatus("denied");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setStatus("granted");
        toast.success("GPS enabled — tracking your location");
        setTimeout(onGranted, 1200);
      },
      () => {
        setStatus("denied");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [open, onGranted]);

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-500" />
            Location Access Required
          </DialogTitle>
          <DialogDescription>
            As a field officer, your GPS location is needed for visit
            verification and real-time tracking.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {status === "requesting" && (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  Requesting location access...
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Please allow location access when prompted
                </p>
              </div>
            </div>
          )}

          {status === "granted" && (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-emerald-400">
                  GPS Enabled
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your location will be tracked during field visits
                </p>
              </div>
            </div>
          )}

          {status === "denied" && (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-amber-500" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-amber-400">
                  Location Access Denied
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  GPS tracking is required for field operations. Please enable
                  location access in your browser settings.
                </p>
              </div>
            </div>
          )}

          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-3.5 h-3.5" />
              <span>Your location is only used for visit verification</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span>Supervisors can see your position on the live map</span>
            </div>
          </div>

          {status === "denied" && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onDenied}
              >
                Continue Without GPS
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setStatus("requesting");
                  navigator.geolocation.getCurrentPosition(
                    () => {
                      setStatus("granted");
                      toast.success("GPS enabled");
                      setTimeout(onGranted, 1200);
                    },
                    () => setStatus("denied"),
                    { enableHighAccuracy: true, timeout: 10000 }
                  );
                }}
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
