export function UserPath(userId: string) {
  return `/messages/user/${userId}`;
}
export function MessagePath(userId: string, messageId: string) {
  return `${UserPath(userId)}/message/${messageId}`;
}
