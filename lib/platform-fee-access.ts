/** Super Admin / Sub Admin / Co Admin — platform markup & processing fee. */
export function isPlatformFeeAdmin(
  profile?: {
    role?: string | null;
    roleCode?: string | null;
  } | null,
): boolean {
  if (!profile) return false;
  const role = String(profile.role || "")
    .trim()
    .toLowerCase();
  const code = String(profile.roleCode || "")
    .trim()
    .toUpperCase();

  return (
    code === "SUPER_ADMIN" ||
    code === "SUB_ADMIN" ||
    code === "CO_ADMIN" ||
    role === "super_admin" ||
    role === "sub_admin" ||
    role === "co_admin"
  );
}
