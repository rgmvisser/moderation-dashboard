import { AppShell, Navbar, Header } from "@mantine/core";
import { NavLink } from "@remix-run/react";
import type { ReactNode } from "react";
import Timer from "~/shared/components/Timer";
import {
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  ListBulletIcon,
  UsersIcon,
  MegaphoneIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import UserMenu from "./UserMenu";
import Logo from "./Logo";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      padding={0}
      navbar={
        <Navbar width={{ base: 200 }} p="md">
          <Navbar.Section>
            <CMNavLink icon={<ChatBubbleLeftRightIcon />} to={"/messages"}>
              Messages
            </CMNavLink>
          </Navbar.Section>
          <Navbar.Section>
            <CMNavLink icon={<ClipboardDocumentListIcon />} to={"/rules"}>
              Rules
            </CMNavLink>
          </Navbar.Section>
          <Navbar.Section>
            <CMNavLink icon={<ListBulletIcon />} to={"/lists"}>
              Lists
            </CMNavLink>
          </Navbar.Section>
          <Navbar.Section>
            <CMNavLink icon={<UsersIcon />} to={"/users"}>
              Users
            </CMNavLink>
          </Navbar.Section>
          <Navbar.Section>
            <CMNavLink icon={<MegaphoneIcon />} to={"/reports"}>
              Reports
            </CMNavLink>
          </Navbar.Section>
          <Navbar.Section>
            <CMNavLink icon={<ClipboardDocumentCheckIcon />} to={"/actions"}>
              Actions
            </CMNavLink>
          </Navbar.Section>

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
          <div className="flex items-center justify-between">
            <Logo />
            <UserMenu />
          </div>
        </Header>
      }
    >
      <div className="h-full w-full bg-slate-50 p-4">{children}</div>
    </AppShell>
  );
}

function CMNavLink({
  icon,
  to,
  children,
}: {
  icon: ReactNode;
  to: string;
  children: ReactNode;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? " text-main" : "")}
    >
      <div className="flex items-center justify-start gap-1 py-2 font-semibold">
        <span className="h-4 w-4">{icon}</span>
        {children}
      </div>
    </NavLink>
  );
}
