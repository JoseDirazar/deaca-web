import { cn } from "@/lib/cn";
import { generateImageUrl } from "@/lib/generate-image-url";

export default function UserAvatar({
  avatar,
  className,
}: {
  avatar?: string;
  className?: string;
}) {
  return (
    <img
      src={generateImageUrl("user", avatar)}
      className={cn("h-24 w-24 rounded-full object-cover", className)}
    />
  );
}
