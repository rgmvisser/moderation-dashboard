export function LoginPath() {
  return "/login";
}

export function DashboardPath() {
  return "/dashboard";
}

export function LogoutPath() {
  return "/logout";
}

export function SettingsPath() {
  return "/settings";
}

export function QueuePath(tenantSlug: string) {
  return `/${tenantSlug}/messages`;
}
export function RulesPath(tenantSlug: string) {
  return `/${tenantSlug}/rules`;
}
export function ListsPath(tenantSlug: string) {
  return `/${tenantSlug}/lists`;
}
export function UsersPath(tenantSlug: string) {
  return `/${tenantSlug}/users`;
}

export function ReportsPath(tenantSlug: string) {
  return `/${tenantSlug}/reports`;
}
export function ActionsPath(tenantSlug: string) {
  return `/${tenantSlug}/actions`;
}

export function UserPath(tenantSlug: string, userId: string) {
  return `${QueuePath(tenantSlug)}/user/${userId}`;
}

export function MessagePath(
  tenantSlug: string,
  userId: string,
  messageId: string
) {
  return `${UserPath(tenantSlug, userId)}/message/${messageId}`;
}
