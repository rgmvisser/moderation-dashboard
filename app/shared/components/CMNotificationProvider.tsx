import { showNotification } from "@mantine/notifications";
import type { ReactNode } from "react";
import { useEffect } from "react";

export type CMNotification =
  | string
  | {
      title: string;
      substitle: string;
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
      console.log("notification", notification);
      if (typeof notification === "string") {
        showNotification({
          message: notification,
        });
      } else {
        showNotification({
          title: notification.title,
          message: notification.substitle,
        });
      }
    }
  }, [notification]);
  return <>{children}</>;
}
