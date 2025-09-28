import { baseURL } from "@/api/axios-instance";

export const generateImageUrl = (
  type: "user" | "establishment" | "establishment_avatar",
  filename?: string | null,
) => {
  if (!filename) return "/default-avatar.png";
  console.log(filename.split(".").includes("googleusercontent") ? filename : `${baseURL}/uploads/user/avatar/${filename}`)
  switch (type) {
    case "user":
      return filename.split(".").includes("googleusercontent") ? filename : `${baseURL}/uploads/user/avatar/${filename}`;
    case "establishment":
      // gallery image stored under uploads/establishments/
      return `${baseURL}/uploads/establishments/${filename}`;
    case "establishment_avatar":
      // avatar stored under uploads/establishments/avatars/
      return `${baseURL}/uploads/establishments/avatars/${filename}`;
    default:
      return "/default-avatar.png";
  }
};
