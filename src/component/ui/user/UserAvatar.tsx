import { generateImageUrl } from "@/lib/generate-image-url";

export default function UserAvatar({ avatar }: { avatar?: string }) {
  console.log({ avatar });
  return (
    <img
      src={generateImageUrl("user", avatar)}
      className="h-24 w-24 rounded-full"
    />
  );
}
