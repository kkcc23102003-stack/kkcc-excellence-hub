import { PlugZap } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SupabaseSetupAlert() {
  return (
    <Alert variant="destructive" className="text-left">
      <PlugZap className="h-4 w-4" />
      <AlertTitle>App connection missing</AlertTitle>
      <AlertDescription>
        Set the app backend environment variables to make login/signup live. Rebuild/restart after
        setup.
      </AlertDescription>
    </Alert>
  );
}
