export const formatRole = (role?: string) => {
  if (!role) return "";

  return role
    .split("_")
    .map((word, index) => (index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(" ");
};
