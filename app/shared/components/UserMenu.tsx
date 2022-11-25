import { Menu, Text } from "@mantine/core";
import React from "react";
import {
  Cog8ToothIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "@remix-run/react";
import { useAppContext } from "../contexts/AppContext";
import { LogoutPath, SettingsPath } from "../utils.tsx/navigation";

// Menu with avatar and dropdown to show user options
export default function UserMenu() {
  const appContext = useAppContext();
  const navigate = useNavigate();

  return (
    <Menu shadow="md" width={250} position="bottom-end" offset={8}>
      <Menu.Target>
        <div className="group mr-4 flex flex-row items-center gap-2 hover:cursor-pointer">
          <div className="text-md font-semibold">
            {appContext.moderator?.name}
          </div>
          <div className="h-8 w-8 overflow-clip rounded-full bg-main transition-all ease-in group-hover:outline group-hover:ring-1 group-hover:ring-main">
            {appContext.moderator?.avatar ? (
              <img
                width="100%"
                height="100%"
                src={appContext.moderator.avatar}
                alt={`${appContext.moderator?.name}'s avatar`}
              />
            ) : (
              <UserIcon className="m-1  text-white" />
            )}
          </div>
        </div>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          className="text-base"
          icon={<Cog8ToothIcon className="h-4 w-4" />}
          onClick={() => navigate(SettingsPath())}
        >
          Settings
        </Menu.Item>
        <Menu.Item
          className="text-base"
          icon={<MagnifyingGlassIcon className="h-4 w-4" />}
          rightSection={
            <Text size="sm" color="dimmed">
              ⌘K
            </Text>
          }
        >
          Search
        </Menu.Item>

        <Menu.Item
          className="text-base"
          onClick={() => navigate(LogoutPath())}
          icon={<ArrowRightOnRectangleIcon className="h-4 w-4" />}
        >
          Logout
        </Menu.Item>

        {/* <Menu.Divider /> */}

        {/* <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item icon={<IconArrowsLeftRight size={14} />}>
          Transfer my data
        </Menu.Item>
        <Menu.Item color="red" icon={<IconTrash size={14} />}>
          Delete my account
        </Menu.Item> */}
      </Menu.Dropdown>
    </Menu>
  );
}
