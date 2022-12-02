import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ActionIcon, Group, TextInput } from "@mantine/core";

import type { ListItem } from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { Form, useNavigate } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { DataTable } from "mantine-datatable";
import { useEffect, useRef, useState } from "react";
import { json, redirect, useActionData, useLoaderData } from "remix-supertyped";
import { z } from "zod";
import { ListController } from "~/controllers/list.server";
import { GetModeratorAndTenant, GetTenant } from "~/middleware/tenant";
import { CMButton } from "~/shared/components/CMButton";
import { DropzoneButton } from "~/shared/components/DropzoneButton";
import { EmptyStateTable } from "~/shared/components/EmptyStateTable";
import { GetDateFormatted } from "~/shared/utils.tsx/date";
import { ListsPath } from "~/shared/utils.tsx/navigation";
import { numericString } from "~/shared/utils.tsx/validate";
import debounce from "lodash.debounce";

const PAGE_SIZE = 20;

export const validator = withZod(
  z.object({
    order: z.enum(["asc", "desc"]).default("desc"),
    orderBy: z.enum(["value", "createdAt"]).default("createdAt"),
    page: numericString(z.number().min(1).default(1)),
    perPage: numericString(z.number().min(1).max(100).default(PAGE_SIZE)),
    filter: z.string().optional(),
  })
);

export const addValidator = withZod(
  z.object({
    value: z
      .string()
      .min(1, { message: "Please fill out an item" })
      .max(100, { message: "Max lenght is 100 characters" })
      .optional(),
    action: z.enum(["addItem", "addItems", "deleteItem", "deleteItems"]),
    id: z.string().optional(),
    ids: z
      .string()
      .transform((s) => s.split(","))
      .optional(),
    values: z
      .string()
      .min(1, { message: "At least 1 item is required" })
      .transform((v) => v.split("\n"))
      .optional(),
  })
);

export async function action({ request, params }: ActionArgs) {
  const { moderator, tenant } = await GetModeratorAndTenant(request, params);
  const listId = params.listId;
  if (!listId) {
    return redirect(ListsPath(tenant.slug));
  }
  const res = await addValidator.validate(await request.formData());
  if (res.error) {
    return json({ error: Object.values(res.error.fieldErrors).join(", ") });
  }
  const { value, action, values, id, ids } = res.data;
  const listController = new ListController(tenant);
  if (action === "addItem" && value) {
    const item = await listController.addItem(moderator, listId, value);
    return json({ item });
  } else if (action === "addItems" && values) {
    const items = await listController.addItems(moderator, listId, values);
    return json({ items });
  } else if (action === "deleteItem" && id) {
    await listController.deleteItem(id);
    return json({});
  } else if (action === "deleteItems" && ids) {
    await listController.deleteItems(ids);
    return json({});
  } else {
    return json({ error: "Invalid request" });
  }
}

export async function loader({ request, params }: LoaderArgs) {
  const tenant = await GetTenant(request, params);
  const listId = params.listId;
  if (!listId) {
    return redirect(ListsPath(tenant.slug));
  }
  const url = new URL(request.url);
  const res = await validator.validate(url.searchParams);
  if (res.error) {
    throw new Error(`Invalid query params: ${url.searchParams.toString()}`);
  }
  const { order, orderBy, perPage, filter } = res.data;
  const listController = new ListController(tenant);
  const total = await listController.countItems(listId);
  let page = (res.data.page - 1) * perPage > total ? 1 : res.data.page;
  const items = await listController.getItems({
    listId,
    page,
    order,
    orderBy,
    perPage,
    filter,
  });
  return json({
    total,
    items,
    order,
    orderBy,
    perPage,
    page,
    filter,
  });
}

export default function List() {
  // const params = useParams();
  // const [opened, setOpened] = useState(true);
  const data = useLoaderData<typeof loader>();
  const { order, orderBy, page, perPage, items, total, filter } = data;
  const actionData = useActionData();
  const navigate = useNavigate();

  const [selectedRecords, setSelectedRecords] = useState<ListItem[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropFormRef = useRef<HTMLFormElement>(null);
  const dropFormItemsRef = useRef<HTMLInputElement>(null);
  const removeFormRef = useRef<HTMLFormElement>(null);
  const removeInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (actionData && !actionData.error) {
      formRef.current?.reset();
      inputRef.current?.focus();
    }
  }, [actionData]);

  function updateTable({
    newFilter,
    newPage,
    newPerPage,
    newOrderBy,
    newOrder,
  }: {
    newFilter?: string;
    newPage?: number;
    newPerPage?: number;
    newOrderBy?: string;
    newOrder?: string;
  }) {
    const url = new URL(window.location.href);
    url.searchParams.set("page", String(newPage ?? page));
    url.searchParams.set("perPage", String(newPerPage ?? perPage));
    url.searchParams.set("orderBy", newOrderBy ?? orderBy);
    url.searchParams.set("order", newOrder ?? order);
    if (newFilter) {
      url.searchParams.set("filter", newFilter);
    } else {
      url.searchParams.delete("filter");
    }
    navigate(url, { replace: true });
  }

  const fileReader = new FileReader();
  fileReader.onload = (e) => {
    const text = e.target?.result as string;
    if (dropFormItemsRef.current) {
      dropFormItemsRef.current.value = text;
      dropFormRef.current?.submit();
    }
  };

  const debouncedSearch = useRef(
    debounce(async (text: string) => {
      console.log("Search!", text);
      updateTable({ newFilter: text });
    }, 300)
  ).current;

  // Cancel any pending debounced search when the component unmounts
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className="flex flex-col gap-4">
      <TextInput
        icon={<MagnifyingGlassIcon className="h-4 w-4" />}
        radius="xl"
        size="md"
        placeholder="Search items"
        defaultValue={filter}
        onChange={(e) => debouncedSearch(e.target.value)}
      />
      <div className="h-96">
        <DataTable
          verticalAlignment="top"
          columns={[
            {
              accessor: "value",

              ellipsis: true,
              sortable: true,
              title: "Item",
            },
            {
              accessor: "createdAt",

              ellipsis: true,
              sortable: true,
              title: "Created At",
              render: (item) => GetDateFormatted(item.createdAt),
            },
            {
              accessor: "actions",
              width: 50,
              title: "",
              textAlignment: "right",
              render: (item) => (
                <Group spacing={4} position="right" noWrap>
                  <Form method="post">
                    <input type="hidden" name="action" value="deleteItem" />
                    <input type="hidden" name="id" value={item.id} />
                    <ActionIcon color="green" type="submit">
                      <TrashIcon className="h-4 w-4" />
                    </ActionIcon>
                  </Form>
                </Group>
              ),
            },
          ]}
          records={items}
          onSortStatusChange={(status) => {
            updateTable({
              newOrderBy: status.columnAccessor,
              newOrder: status.direction,
            });
          }}
          onPageChange={(page) => {
            updateTable({
              newPage: page,
            });
          }}
          page={page}
          recordsPerPage={perPage}
          totalRecords={total}
          sortStatus={{
            columnAccessor: orderBy,
            direction: order as "asc" | "desc",
          }}
          selectedRecords={selectedRecords}
          onSelectedRecordsChange={setSelectedRecords}
          emptyState={<EmptyStateTable>No items yet</EmptyStateTable>}
          noRecordsText=""
        />
      </div>
      {selectedRecords.length > 0 && (
        <div className="self-end">
          <Form method="post">
            <input type="hidden" name="action" value="deleteItems" />
            <input
              type="hidden"
              name="ids"
              value={selectedRecords.map((i) => i.id).join(",")}
            />
            <CMButton status="hidden" type="submit">
              Delete {selectedRecords.length} item
              {selectedRecords.length > 1 && "s"}
            </CMButton>
          </Form>
        </div>
      )}

      {actionData?.error && (
        <div key="name-error" className="text-xs text-red-500">
          {actionData?.error}
        </div>
      )}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Add a new items</h2>
        <Form ref={formRef} method="post">
          <div className="flex gap-2">
            <input type="hidden" name="action" value="addItem" />
            <TextInput
              type="text"
              name="value"
              placeholder="item"
              ref={inputRef}
            />
            <CMButton type="submit">Add Item</CMButton>
          </div>
        </Form>
      </div>
      <div>
        <h2 className="mb-4 text-lg font-semibold">Or upload file</h2>
        <Form ref={dropFormRef} method="post">
          <input type="hidden" name="action" value="addItems" />
          <input type="hidden" name="values" value="" ref={dropFormItemsRef} />
        </Form>
        <DropzoneButton
          onDrop={(files) => {
            fileReader.readAsText(files[0]);
          }}
        />
      </div>
    </div>
  );
}

// export function ErrorBoundary({ error }: { error: Error }) {
//   console.error(error);
//   return (
//     <div className="flex h-full flex-col items-center justify-center">
//       <h1 className="text-2xl font-semibold">Something went wrong</h1>
//       <p className="text-sm text-gray-500">
//         Please try again later or contact support
//       </p>
//     </div>
//   );
// }
