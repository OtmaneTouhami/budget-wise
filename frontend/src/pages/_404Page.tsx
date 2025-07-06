import { Button } from "@/components/ui/button";
import { Link, useRouteError } from "react-router-dom";

export const _404Page = () => {
  const error = useRouteError() as any;
  console.error(error);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <div className="text-center">
        <h1 className="text-9xl font-black text-primary">404</h1>
        <p className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
          Uh-oh!
        </p>
        <p className="mt-4 text-muted-foreground">
          We can't find the page you're looking for.
        </p>
      </div>
      <p className="text-center text-lg font-medium text-destructive">
        <i>{error.statusText || error.message}</i>
      </p>
      <Button asChild>
        <Link to="/">Go Back Home</Link>
      </Button>
    </div>
  );
};
