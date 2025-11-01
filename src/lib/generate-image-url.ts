import { uploadBaseUrl } from "./constants/enviroment-variables";

export const generateImageUrl = (
  type:
    | "user"
    | "establishment"
    | "category"
    | "establishment-logo"
    | "nature-spot-logo"
    | "nature-spot-image"
    | "event-logo"
    | "event-image",
  filename?: string | null,
) => {
  if (!filename) return "/default-avatar.png";
  switch (type) {
    case "user":
      return `${uploadBaseUrl}/user/${filename}`;
    case "establishment":
      return `${uploadBaseUrl}/establishment/${filename}`;
    case "establishment-logo":
      return `${uploadBaseUrl}/establishment/logo/${filename}`;
    case "nature-spot-logo":
      return `${uploadBaseUrl}/nature-spot/logo/${filename}`;
    case "nature-spot-image":
      return `${uploadBaseUrl}/nature-spot/${filename}`;
    case "category":
      return `${uploadBaseUrl}/category/${filename}`;
    case "event-logo":
      return `${uploadBaseUrl}/event/logo/${filename}`;
    case "event-image":
      return `${uploadBaseUrl}/event/${filename}`;
  }
};
