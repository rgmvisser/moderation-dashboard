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

export const loadValidator = withZod(
  z.object({
    listFilter: z.string().optional(),
  })
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
  const url = new URL(request.url);
  const res = await loadValidator.validate(url.searchParams);
  if (res.error) {
    throw new Error(`Invalid query params: ${url.searchParams.toString()}`);
  }
  const listFilter = res.data.listFilter;
  const listController = new ListController(tenant);
  const lists = await listController.getAllLists(listFilter);
  const listWithCounts = await Promise.all(
    lists.map(async (list) => {
      const count = await listController.countItems(list.id);
      return { list, count };
    })
  );
  return json({
    listWithCounts,
    listTypes: ListTypes,
    listFilter,
  });
}

export default function Lists() {
  const params = useParams();
  const [opened, setOpened] = useState(params.listId !== undefined);
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData();
  const tenantContext = useTenantContext();
  const { listWithCounts, listTypes } = data;
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

  function filter(text: string) {
    const url = new URL(window.location.href);
    if (text) {
      url.searchParams.set("listFilter", text);
    } else {
      url.searchParams.delete("listFilter");
    }
    navigate(url, { replace: true });
  }

  return (
    <DashboardContainer
      title="Lists"
      rightItem={
        <DebouncedInput
          icon={<MagnifyingGlassIcon className="h-4 w-4" />}
          radius="xl"
          size="md"
          placeholder="Search items"
          defaultValue={data.listFilter}
          onDebounceChange={(text) => filter(text)}
        />
      }
    >
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
          {listWithCounts.map(({ list, count }) => (
            <tr
              key={list.id}
              className="hover:cursor-pointer"
              onClick={() =>
                navigate(ListPath(tenantContext.tenant.slug, list.id))
              }
            >
              <td>{list.name}</td>
              <td>{ListTypeName(list.type)}</td>
              <td>
                {list.items.length !== count
                  ? `${list.items.length} / ${count}`
                  : count}
              </td>
              <td>
                {list.items.length === 0 && "-"}
                {list.items.slice(0, previewItems).map((item, index) => {
                  return (
                    <span key={item.value}>
                      <span className="rounded bg-slate-100 p-[2px] ">
                        {item.value}
                      </span>
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
      {listWithCounts.length === 0 && (
        <EmptyStateTable>No lists yet</EmptyStateTable>
      )}

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
    </DashboardContainer>
  );
}
