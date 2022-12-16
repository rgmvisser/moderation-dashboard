import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect, useActionData, useLoaderData } from "remix-supertyped";
import { GetDateFormatted } from "~/shared/utils.tsx/date";
import { GetTenant } from "~/middleware/tenant";
import { ListController } from "~/controllers/list.server";
import {
  ActionIcon,
  Code,
  Drawer,
  Select,
  Table,
  TextInput,
} from "@mantine/core";
import { Form, Outlet, useNavigate, useParams } from "@remix-run/react";
import { CMButton } from "~/shared/components/CMButton";
import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRef, useEffect, useState } from "react";
import { ListTypeName, ListTypes } from "~/models/list";
import { EmptyStateTable } from "~/shared/components/EmptyStateTable";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { ListType } from "@prisma/client";
import { ListPath, ListsPath } from "~/shared/utils.tsx/navigation";
import { useTenantContext } from "~/shared/contexts/TenantContext";
import { SubHeading } from "~/shared/components/SubHeading";
import { DebouncedInput } from "~/shared/components/DebouncedInput";
import { ModeratorController } from "~/controllers/moderator.server";
import DashboardContainer from "~/shared/components/DashboardContainer";

export const postValidator = withZod(
  z.union([
    z.object({
      action: z.literal("remove"),
      id: z.string().cuid(),
    }),
    z.object({
      action: z.literal("add"),
      name: z.string().min(3).max(100),
      type: z.nativeEnum(ListType, {
        errorMap: (issue, ctx) => {
          return { message: "Please select a type" };
        },
      }),
    }),
  ])
);
export async function action({ request, params }: ActionArgs) {
  const tenant = await GetTenant(request, params);
  const res = await postValidator.validate(await request.formData());
  if (res.error) {
    console.log(res.error);
    if (res.error.fieldErrors.type) {
      return json({ error: res.error.fieldErrors.type });
    }
    return json({ error: res.error.fieldErrors.name });
  }
  const listController = new ListController(tenant);
  const { action } = res.data;
  if (action === "add") {
    const { name, type } = res.data;
    const list = await listController.createList(name, type);
    return redirect(ListPath(tenant.slug, list.id));
  } else if (action === "remove") {
    const { id } = res.data;
    await listController.deleteList(id);
    return json({});
  } else {
    return json({ error: "Invalid request" });
  }
}

export async function loader({ request, params }: LoaderArgs) {
  const tenant = await GetTenant(request, params);
  const moderatorController = new ModeratorController(tenant);
  const moderators = await moderatorController.getAllModerators();
  return json({
    moderators,
  });
}

export default function Moderators() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData();
  const tenantContext = useTenantContext();
  const { moderators } = data;

  return (
    <DashboardContainer title="Moderators">
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created At</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {moderators.map((moderator) => (
            <tr key={moderator.id}>
              <td>{moderator.name}</td>
              <td>{moderator.email}</td>
              <td>{moderator.roles[0].role}</td>
              <td>{GetDateFormatted(moderator.createdAt)}</td>
              <td>
                <Form
                  method="post"
                  onSubmit={(event) => {
                    if (
                      !confirm("Are you sure? This action cannot be undone.")
                    ) {
                      event.preventDefault();
                    }
                  }}
                >
                  <input type="hidden" name="id" value={moderator.id} />
                  <input type="hidden" name="action" value="remove" />
                  <ActionIcon
                    color="red"
                    type="submit"
                    onClick={(e: any) => {
                      e.stopPropagation();
                    }}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </ActionIcon>
                </Form>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {moderators.length === 0 && (
        <EmptyStateTable>No moderators yet</EmptyStateTable>
      )}
    </DashboardContainer>
  );
}
