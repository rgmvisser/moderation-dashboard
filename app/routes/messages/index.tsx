import { LoaderArgs, SerializeFrom } from "@remix-run/node";
import { Form, Link, NavLink, Outlet } from "@remix-run/react";
import { json, useLoaderData } from "remix-supertyped";
import { prisma } from "~/db.server";
import MessageBox from "~/shared/components/MessageBox";

export async function loader({ request }: LoaderArgs) {
  const messages = await prisma.message.findMany({
    take: 20,
    include: {
      user: true,
    },
  });
  return json({ messages });
}

export default function Messages() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex w-[400px] flex-shrink-0 flex-grow-0 flex-col items-start justify-start self-stretch overflow-hidden bg-[#f8f9fa]">
      {data.messages.map((message) => {
        return (
          <MessageBox key={message.id} messsage={message} user={message.user} />
        );
      })}
    </div>
  );
}
