import { baseURL } from "@/api/axios-instance";

export const generateImageUrl = (
  filename: string | null,
  type: "user" | "establishment",
) => {
  if (!filename) return "/default-avatar.png";

  switch (type) {
    case "user":
      return filename.split(".").includes("googleusercontent") ? filename : `${baseURL}/uploads/user/avatar/${filename}`;
    case "establishment":
      return `${baseURL}/uploads/establishment/${filename}`;
    default:
      return "/default-avatar.png";
  }
};
