export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  const adminEmails = (process.env.ADMIN_EMAILS || "admin@acmecorp.com").split(",").map((item) => item.trim().toLowerCase());
  return adminEmails.includes(email.toLowerCase());
}
