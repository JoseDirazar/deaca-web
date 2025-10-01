import { uploadBaseURL } from "@/api/axios-instance";

export const generateImageUrl = (
  type: "user" | "establishment",
  filename?: string | null,
) => {
  if (!filename) return "/default-avatar.png";

  if (filename.split(".").includes("googleusercontent")) return filename;
  switch (type) {
    case "user":
      return `${uploadBaseURL}/user/avatar/${filename}`;
    case "establishment":
      return `${uploadBaseURL}/user/establishment/${filename}`;
  }
};
