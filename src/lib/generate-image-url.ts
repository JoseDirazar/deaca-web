import { uploadBaseUrl } from "./constants/enviroment-variables";


export const generateImageUrl = (
  type: "user" | "establishment" | "category",
  filename?: string | null,
) => {
  if (!filename) return "/default-avatar.png";

  if (filename.split(".").includes("googleusercontent")) return filename;
  switch (type) {
    case "user":
      return `${uploadBaseUrl}/user/avatar/${filename}`;
    case "establishment":
      return `${uploadBaseUrl}/user/establishment/${filename}`;
    case "category":
      return `${uploadBaseUrl}/assets/${filename}`;
  }
};
