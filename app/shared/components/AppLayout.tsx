import { AppShell, Navbar, Header } from "@mantine/core";
import { NavLink } from "@remix-run/react";
import type { ReactNode } from "react";
import {
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  ListBulletIcon,
  UsersIcon,
  MegaphoneIcon,
  ClipboardDocumentCheckIcon,
  Cog8ToothIcon,
  UserGroupIcon,
  BellAlertIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import UserMenu from "./UserMenu";
import Logo, { CustomerLogo, LassoLogo } from "./Logo";
import { useTenantContext } from "../contexts/TenantContext";
import {
  ActionsPath,
  AlertsPath,
  ContentRulesPath,
  ListsPath,
  QueuePath,
  ReportsPath,
  RulesPath,
  TenantModeratorsPath,
  TenantSettingsPath,
  UsersRulesPath,
  UsersPath,
} from "../utils.tsx/navigation";
import classNames from "classnames";

export default function AppLayout({ children }: { children: ReactNode }) {
  const tenantContext = useTenantContext();
  const tenantSlug = tenantContext.tenant.slug;
  return (
    <AppShell
      padding={0}
      navbar={
        <Navbar width={{ base: 200 }} p="md">
          <Navbar.Section>
            <CMNavLink
              icon={<ChatBubbleLeftRightIcon />}
              to={QueuePath(tenantSlug)}
            >
              Contents
            </CMNavLink>
          </Navbar.Section>
          <Navbar.Section>
            <CMNavLink
              icon={<ClipboardDocumentCheckIcon />}
              to={RulesPath(tenantSlug)}
              hasSubmenu
            >
              Rules
            </CMNavLink>
            <CMNavLink
              icon={<ClipboardDocumentListIcon />}
              to={ContentRulesPath(tenantSlug)}
              submenu
            >
              Content
            </CMNavLink>
            <CMNavLink
              icon={<UserCircleIcon />}
              to={UsersRulesPath(tenantSlug)}
              submenu
            >
              Users
            </CMNavLink>
          </Navbar.Section>
          <Navbar.Section>
            <CMNavLink icon={<ListBulletIcon />} to={ListsPath(tenantSlug)}>
              Lists
            </CMNavLink>
          </Navbar.Section>
          <Navbar.Section>
            <CMNavLink icon={<UsersIcon />} to={UsersPath(tenantSlug)}>
              Users
            </CMNavLink>
          </Navbar.Section>
          <Navbar.Section>
            <CMNavLink icon={<MegaphoneIcon />} to={ReportsPath(tenantSlug)}>
              Reports
            </CMNavLink>
          </Navbar.Section>
          <Navbar.Section>
            <CMNavLink icon={<BellAlertIcon />} to={AlertsPath(tenantSlug)}>
              Alerts
            </CMNavLink>
          </Navbar.Section>
          <Navbar.Section>
            <CMNavLink
              icon={<ClipboardDocumentCheckIcon />}
              to={ActionsPath(tenantSlug)}
            >
              Actions
            </CMNavLink>
          </Navbar.Section>

          <Navbar.Section grow mt="md" className="border-b border-main">
            {" "}
          </Navbar.Section>

          <Navbar.Section>
            <CMNavLink
              icon={<Cog8ToothIcon />}
              to={TenantSettingsPath(tenantSlug)}
            >
              Settings
            </CMNavLink>
          </Navbar.Section>

          <Navbar.Section>
            <CMNavLink
              icon={<UserGroupIcon />}
              to={TenantModeratorsPath(tenantSlug)}
            >
              Moderators
            </CMNavLink>
          </Navbar.Section>

          <Navbar.Section>
            <CMNavLink
              icon={
                <img
                  height={16}
                  width={16}
                  alt={`${tenantContext.tenant.name} logo`}
                  src={
                    "https://global-uploads.webflow.com/612e0e79f82694f1de746286/6135e40cd050652fcb9a3a49_Logo%20Woov.svg"
                  }
                />
              }
              to={TenantModeratorsPath(tenantSlug)}
            >
              {tenantContext.tenant.name}
            </CMNavLink>
          </Navbar.Section>

          {/* <Navbar.Section>
            <Timer />
          </Navbar.Section> */}
        </Navbar>
      }
      header={
        <Header height={60} p="md">
          <div className="flex items-center justify-between">
            <div className="flex">
              <LassoLogo />

              {/* <CustomerLogo
                logoURL="https://global-uploads.webflow.com/612e0e79f82694f1de746286/6135e40cd050652fcb9a3a49_Logo%20Woov.svg"
                name={tenantContext.tenant.name}
              /> */}
            </div>
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
  submenu = false,
  hasSubmenu = false,
}: {
  icon: ReactNode;
  to: string;
  children: ReactNode;
  submenu?: boolean;
  hasSubmenu?: boolean;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive && !hasSubmenu ? "bg-main text-white" : ""
      }
      children={({ isActive }) => (
        <>
          <span
            className={classNames(
              "gap- my-1 flex items-center justify-start gap-1 rounded-md bg-inherit p-2 py-2 font-semibold",
              submenu && "ml-4"
            )}
          >
            <span className="h-4 w-4">{icon}</span>
            {children}
          </span>
        </>
      )}
    />
  );
}
