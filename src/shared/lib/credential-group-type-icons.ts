import {
  Mail,
  Gamepad2,
  Server,
  Users,
  Database,
  Globe,
  Shield,
  Key,
  CreditCard,
  Smartphone,
  Monitor,
  Cloud,
  Lock,
  Folder,
} from "lucide-react";

// Icon mapping for credential group types
export const getCredentialGroupTypeIcon = (
  typeName: string | null | undefined
) => {
  if (!typeName) return Folder;

  const type = typeName.toLowerCase();

  switch (type) {
    case "mail":
    case "email":
      return Mail;
    case "game":
    case "gaming":
      return Gamepad2;
    case "server":
    case "vps":
      return Server;
    case "social":
    case "social media":
      return Users;
    case "database":
    case "db":
      return Database;
    case "website":
    case "web":
      return Globe;
    case "security":
    case "auth":
      return Shield;
    case "api":
    case "key":
      return Key;
    case "payment":
    case "finance":
      return CreditCard;
    case "mobile":
    case "app":
      return Smartphone;
    case "desktop":
    case "pc":
      return Monitor;
    case "cloud":
    case "storage":
      return Cloud;
    case "password":
    case "credential":
      return Lock;
    default:
      return Folder;
  }
};

// Color mapping for credential group types
export const getCredentialGroupTypeColor = (
  typeName: string | null | undefined
) => {
  if (!typeName) return "text-gray-500";

  const type = typeName.toLowerCase();

  switch (type) {
    case "mail":
    case "email":
      return "text-blue-600";
    case "game":
    case "gaming":
      return "text-purple-600";
    case "server":
    case "vps":
      return "text-green-600";
    case "social":
    case "social media":
      return "text-pink-600";
    case "database":
    case "db":
      return "text-orange-600";
    case "website":
    case "web":
      return "text-cyan-600";
    case "security":
    case "auth":
      return "text-red-600";
    case "api":
    case "key":
      return "text-yellow-600";
    case "payment":
    case "finance":
      return "text-emerald-600";
    case "mobile":
    case "app":
      return "text-indigo-600";
    case "desktop":
    case "pc":
      return "text-slate-600";
    case "cloud":
    case "storage":
      return "text-sky-600";
    case "password":
    case "credential":
      return "text-gray-600";
    default:
      return "text-gray-500";
  }
};

// Background color mapping for credential group types (for badges, etc.)
export const getCredentialGroupTypeBgColor = (
  typeName: string | null | undefined
) => {
  if (!typeName) return "bg-gray-100";

  const type = typeName.toLowerCase();

  switch (type) {
    case "mail":
    case "email":
      return "bg-blue-100";
    case "game":
    case "gaming":
      return "bg-purple-100";
    case "server":
    case "vps":
      return "bg-green-100";
    case "social":
    case "social media":
      return "bg-pink-100";
    case "database":
    case "db":
      return "bg-orange-100";
    case "website":
    case "web":
      return "bg-cyan-100";
    case "security":
    case "auth":
      return "bg-red-100";
    case "api":
    case "key":
      return "bg-yellow-100";
    case "payment":
    case "finance":
      return "bg-emerald-100";
    case "mobile":
    case "app":
      return "bg-indigo-100";
    case "desktop":
    case "pc":
      return "bg-slate-100";
    case "cloud":
    case "storage":
      return "bg-sky-100";
    case "password":
    case "credential":
      return "bg-gray-100";
    default:
      return "bg-gray-100";
  }
};
