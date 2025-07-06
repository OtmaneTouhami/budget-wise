import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useConnection } from "@/providers/ConnectionProvider";
import { Button } from "@/components/ui/button";

export const ConnectionErrorDialog: React.FC = () => {
  const { status, checkNow } = useConnection();
  const [open, setOpen] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  // Show dialog when disconnected, but only after 2 seconds to avoid flash on initial load
  useEffect(() => {
    if (status === "disconnected") {
      const timer = setTimeout(() => {
        setOpen(true);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setOpen(false);
    }
  }, [status]);

  const handleRetry = async () => {
    setAttemptCount((prev) => prev + 1);
    await checkNow();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>API Connection Error</AlertDialogTitle>
          <AlertDialogDescription>
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Connection Failed</AlertTitle>
              <AlertDescription>
                Cannot connect to the backend API server. This may cause parts
                of the application to not work properly.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <p>Please check the following:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Is your backend server running?</li>
                <li>Is it accessible at port 8080?</li>
                <li>Are there any network issues?</li>
              </ul>

              <p className="text-sm text-muted-foreground mt-2">
                {attemptCount > 0 && (
                  <span>Retry attempts: {attemptCount}</span>
                )}
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Dismiss</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="default" onClick={handleRetry}>
              Retry Connection
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
