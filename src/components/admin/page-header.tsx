import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  action?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-3">
        <Icon className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {description ? (
            <p className="text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>
      {action}
    </div>
  );
}
