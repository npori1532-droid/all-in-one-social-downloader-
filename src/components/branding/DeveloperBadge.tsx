import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export function DeveloperBadge() {
  return (
    <Badge variant="developer" className="gap-1.5 px-3 py-1 text-xs">
      <Star className="size-3.5" />
      Developer Tech Master
    </Badge>
  );
}
