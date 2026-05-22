import { cn } from "@/lib/utils";

const variants: Record<string, string> = {
  active: "bg-green-500/10 text-green-600 border-green-500/20",
  inactive: "bg-red-500/10 text-red-600 border-red-500/20",
  OPEN: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  CLOSED: "bg-green-500/10 text-green-600 border-green-500/20",
  CANCELLED: "bg-red-500/10 text-red-600 border-red-500/20",
  AVAILABLE: "bg-green-500/10 text-green-600 border-green-500/20",
  OCCUPIED: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  RESERVED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  INACTIVE: "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

const labels: Record<string, string> = {
  OPEN: "Aberta",
  CLOSED: "Fechada",
  CANCELLED: "Cancelada",
  AVAILABLE: "Disponível",
  OCCUPIED: "Ocupada",
  RESERVED: "Reservada",
  INACTIVE: "Inativa",
  active: "Ativo",
  inactive: "Inativo",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = status in variants ? status : "inactive";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        variants[key],
        className,
      )}
    >
      {labels[status] ?? status}
    </span>
  );
}
