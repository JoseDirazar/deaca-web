export const generateImageUrl = (
  filename: string | null,
  type: "user" | "establishment",
) => {
  if (!filename) return "/default-avatar.png";

  const baseUrl =
    import.meta.env.VITE_PUBLIC_BASE_API_URL || "http://localhost:4002";

  switch (type) {
    case "user":
      return `${baseUrl}/uploads/user/avatar/${filename}`;
    case "establishment":
      return `${baseUrl}/uploads/establishment/${filename}`;
    default:
      return "/default-avatar.png";
  }
};
