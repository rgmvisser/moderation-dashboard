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
import { TrashIcon } from "@heroicons/react/24/outline";
import { useRef, useEffect, useState } from "react";
import { ListTypeName, ListTypes } from "~/models/list";
import { EmptyStateTable } from "~/shared/components/EmptyStateTable";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { ListType } from "@prisma/client";
import { ListPath, ListsPath } from "~/shared/utils.tsx/navigation";
import { useTenantContext } from "~/shared/contexts/TenantContext";
import { SubHeading } from "~/shared/components/SubHeading";

export const validator = withZod(
  z.object({
    name: z.string().min(3).max(100).optional(),
    type: z.nativeEnum(ListType).optional(),
    action: z.enum(["add", "remove"]),
    id: z.string().optional(),
  })
);

export async function action({ request, params }: ActionArgs) {
  const tenant = await GetTenant(request, params);
  const res = await validator.validate(await request.formData());
  if (res.error) {
    return json({ error: res.error.fieldErrors.name });
  }
  const listController = new ListController(tenant);
  const { name, action, id, type } = res.data;
  if (action === "add" && name && type) {
    const list = await listController.createList(name, type);
    return redirect(ListPath(tenant.slug, list.id));
  } else if (action === "remove" && id) {
    await listController.deleteList(id);
    return json({});
  } else {
    return json({ error: "Invalid request" });
  }
}

export async function loader({ request, params }: LoaderArgs) {
  const tenant = await GetTenant(request, params);
  const listController = new ListController(tenant);
  const lists = await listController.getAllLists();
  return json({
    lists,
    listTypes: ListTypes,
  });
}

export default function Lists() {
  const params = useParams();
  const [opened, setOpened] = useState(params.listId !== undefined);
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData();
  const tenantContext = useTenantContext();
  const { lists, listTypes } = data;
  const navigate = useNavigate();

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (actionData && !actionData.error) {
      formRef.current?.reset();
    }
  }, [actionData]);

  useEffect(() => {
    if (params.listId) {
      setOpened(true);
    } else {
      setOpened(false);
    }
  }, [params.listId]);
  const previewItems = 10;

  return (
    <div className="flex h-full flex-col gap-2">
      <h1>Lists</h1>
      <div className="flex h-full flex-col gap-4 rounded-xl bg-white p-4">
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Num Items</th>
              <th>Items</th>
              <th>Last Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lists.map((list) => (
              <tr
                key={list.id}
                className="hover:cursor-pointer"
                onClick={() =>
                  navigate(ListPath(tenantContext.tenant.slug, list.id))
                }
              >
                <td>{list.name}</td>
                <td>{ListTypeName(list.type)}</td>
                <td>{list.items.length}</td>
                <td>
                  {list.items.length === 0 && "-"}
                  {list.items.slice(0, previewItems).map((item, index) => {
                    return (
                      <span key={item.value}>
                        <Code>{item.value}</Code>
                        {index !==
                          Math.min(previewItems, list.items.length) - 1 && ", "}
                        {index == previewItems - 1 &&
                          list.items.length > previewItems && (
                            <span>
                              {" "}
                              and {list.items.length - previewItems} more...
                            </span>
                          )}
                      </span>
                    );
                  })}
                </td>
                <td>{GetDateFormatted(list.updatedAt)}</td>
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
                    <input type="hidden" name="id" value={list.id} />
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
        {lists.length === 0 && <EmptyStateTable>No lists yet</EmptyStateTable>}

        <Form ref={formRef} method="post">
          <div className="flex gap-2">
            <input type="hidden" name="action" value="add" />
            <TextInput type="text" name="name" placeholder="List name" />
            <Select
              name="type"
              placeholder={`Select type of list`}
              data={listTypes.map((type) => ({
                label: ListTypeName(type),
                value: type,
              }))}
            />
            <CMButton type="submit">Create new list</CMButton>
          </div>
          {actionData?.error && (
            <div key="name-error" className="text-xs text-red-500">
              {actionData?.error}
            </div>
          )}
        </Form>
      </div>
      <Drawer
        opened={opened}
        onClose={() => navigate(ListsPath(tenantContext.tenant.slug))}
        title={<SubHeading className="mb-0">Edit list</SubHeading>}
        padding="md"
        size="xl"
        position="right"
      >
        <Outlet />
      </Drawer>
    </div>
  );
}
