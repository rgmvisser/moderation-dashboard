import { AppShell, Navbar, Header } from "@mantine/core";
import { Outlet } from "@remix-run/react";
import Timer from "~/shared/components/Timer";
import { TimerProvider } from "~/shared/contexts/TimerContext";

// import { Link } from "@remix-run/react";

export default function Index() {
  return <div>index</div>;
}
