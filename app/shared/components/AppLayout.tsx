import { AppShell, Navbar, Header } from "@mantine/core";
import type { ReactNode } from "react";
import Timer from "~/shared/components/Timer";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 200 }} p="md">
          <Navbar.Section mt="xs">Messages</Navbar.Section>
          <Navbar.Section grow mt="md">
            {" "}
          </Navbar.Section>
          <Navbar.Section>
            <Timer />
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={60} p="md" className="flex gap-2 text-lg font-bold">
          <img
            height={30}
            width={30}
            alt="Woov logo"
            src="https://global-uploads.webflow.com/612e0e79f82694f1de746286/6135e40cd050652fcb9a3a49_Logo%20Woov.svg"
          />{" "}
          Woov Content Moderation Prototype
        </Header>
      }
    >
      {children}
    </AppShell>
  );
}
