import { showNotification } from "@mantine/notifications";
import type { ReactNode } from "react";
import { useEffect } from "react";

export type CMNotification = {
  id: string;
  title: string;
  substitle?: string;
};

export function CMNotificationProvider({
  notification,
  children,
}: {
  notification?: CMNotification;
  children: ReactNode;
}) {
  useEffect(() => {
    if (notification) {
      const id = notification.id + notification.title;
      if (!notification.substitle) {
        showNotification({
          id: id,
          message: notification.title,
        });
      } else {
        showNotification({
          id: id,
          title: notification.title,
          message: notification.substitle,
        });
      }
    }
  }, [notification]);
  return <>{children}</>;
}
