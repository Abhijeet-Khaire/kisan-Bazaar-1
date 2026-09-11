import { Card, CardContent } from "@/components/ui/card";

import { cn } from "@/lib/utils";



export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default"
}) {
  return (
    <Card className={cn(
      "border-border transition-all hover:shadow-md",
      variant === "primary" && "bg-primary text-primary-foreground",
      variant === "accent" && "bg-accent border-accent-foreground/20"
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className={cn(
              "text-sm font-medium",
              variant === "default" && "text-muted-foreground",
              variant === "primary" && "text-primary-foreground/80",
              variant === "accent" && "text-accent-foreground/80"
            )}>
              {title}
            </p>
            <p className={cn(
              "text-2xl font-bold tracking-tight",
              variant === "default" && "text-foreground",
              variant === "primary" && "text-primary-foreground",
              variant === "accent" && "text-accent-foreground"
            )}>
              {value}
            </p>
            {subtitle && (
              <p className={cn(
                "text-sm",
                variant === "default" && "text-muted-foreground",
                variant === "primary" && "text-primary-foreground/70",
                variant === "accent" && "text-accent-foreground/70"
              )}>
                {subtitle}
              </p>
            )}
            {trend && (
              <p className={cn(
                "text-sm font-medium",
                trend.isPositive ? "text-chart-1" : "text-destructive"
              )}>
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </p>
            )}
          </div>
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg",
            variant === "default" && "bg-accent text-accent-foreground",
            variant === "primary" && "bg-primary-foreground/20 text-primary-foreground",
            variant === "accent" && "bg-accent-foreground/10 text-accent-foreground"
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
