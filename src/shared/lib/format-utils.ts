/**
 * Converts camelCase or snake_case string to Title Case
 * Examples:
 * - "mail" -> "Mail"
 * - "vpsServer" -> "Vps Server"
 * - "emailAddress" -> "Email Address"
 * - "smtp_host" -> "Smtp Host"
 */
export function toTitleCase(str: string): string {
  if (!str) return str;

  // First, handle camelCase by adding space before capital letters
  const withSpaces = str.replace(/([A-Z])/g, " $1");

  // Handle snake_case by replacing underscores with spaces
  const normalized = withSpaces.replace(/_/g, " ");

  // Capitalize first letter of each word
  return normalized
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Converts camelCase to kebab-case for HTML IDs
 * Examples:
 * - "emailAddress" -> "email-address"
 * - "vpsServer" -> "vps-server"
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "");
}
