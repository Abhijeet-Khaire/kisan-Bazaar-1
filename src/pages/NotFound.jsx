import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="text-center max-w-md bg-card p-8 rounded-2xl border shadow-sm flex flex-col items-center">
        <div className="h-16 w-16 rounded-2xl bg-white dark:bg-white/95 p-1.5 shadow-sm border border-border/50 mb-4 flex items-center justify-center">
          <img src="/logo-icon.png" alt="Kisan Bazaar" className="h-full w-full object-contain" />
        </div>
        <h1 className="mb-2 text-4xl font-bold font-serif text-foreground">404</h1>
        <p className="mb-6 text-muted-foreground">Oops! The page you are looking for doesn't exist.</p>
        <Link to="/">
          <Button className="font-medium">
            Return to Kisan Bazaar Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
