import { ROLES } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Role = keyof typeof ROLES;

export default function RoleBadge({ role, className }: { role: string; className?: string }) {
  const config = ROLES[role as Role] ?? { label: role, color: "bg-gray-100 text-gray-700" };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", config.color, className)}>
      {config.label}
    </span>
  );
}
