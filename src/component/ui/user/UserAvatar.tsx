import { generateImageUrl } from "@/lib/generate-image-url";

export default function UserAvatar({ avatar }: { avatar?: string }) {
  return (
    <img
      src={generateImageUrl("user", avatar)}
      className="h-24 w-24 rounded-full"
    />
  );
}
