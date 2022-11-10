import { AppShell, Navbar, Header } from "@mantine/core";
import { Outlet } from "@remix-run/react";
import type { ReactNode } from "react";
import Timer from "~/shared/components/Timer";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 200 }} p="md">
          <Navbar.Section mt="xs">Moderation Prototype</Navbar.Section>
          <Navbar.Section grow mt="md">
            {" "}
          </Navbar.Section>
          <Navbar.Section>
            <Timer />
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={60} p="md">
          Header
        </Header>
      }
    >
      {children}
      <Outlet />
    </AppShell>
  );
}
