import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { z } from "zod";
import { json, useActionData, useLoaderData } from "remix-supertyped";
import { withZod } from "@remix-validated-form/with-zod";
import { GetDateFormatted } from "~/shared/utils.tsx/date";
import { Form } from "@remix-run/react";
import { GetModeratorAndTenant, GetTenant } from "~/middleware/tenant";
import { APIKeyController } from "~/controllers/apikey.server";
import { ActionIcon, Code, CopyButton, Table, TextInput } from "@mantine/core";
import { CMButton } from "~/shared/components/CMButton";

import { Notification } from "@mantine/core";
import {
  CheckIcon,
  ClipboardIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";
import { EmptyStateTable } from "~/shared/components/EmptyStateTable";
import DashboardContainer from "~/shared/components/DashboardContainer";

export const validator = withZod(
  z.object({
    name: z.string().min(3).max(100).optional(),
    type: z.enum(["add", "remove"]),
    id: z.string().optional(),
  })
);

export async function action({ request, params }: ActionArgs) {
  const { moderator, tenant } = await GetModeratorAndTenant(request, params);
  const res = await validator.validate(await request.formData());
  if (res.error) {
    return json({ error: res.error.fieldErrors.name });
  }
  if (res.data.type === "add" && res.data.name) {
    const apiKeyController = new APIKeyController(tenant);
    const { key, keySecret } = await apiKeyController.createKey(
      moderator,
      res.data.name
    );
    return json({ key, keySecret });
  } else if (res.data.type === "remove" && res.data.id) {
    const apiKeyController = new APIKeyController(tenant);
    await apiKeyController.deleteKey(res.data.id);
    return json({});
  } else {
    return json({ error: "Invalid request" });
  }
}

export async function loader({ request, params }: LoaderArgs) {
  const tenant = await GetTenant(request, params);
  const apiKeyController = new APIKeyController(tenant);
  const apiKeys = await apiKeyController.getKeys();

  return json({
    apiKeys: apiKeys,
  });
}

export default function Settings() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData();

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (actionData && !actionData.error) {
      formRef.current?.reset();
    }
  }, [actionData]);

  return (
    <DashboardContainer title="Settings">
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Key</th>
            <th>Created By</th>
            <th>Created At</th>
            <th className="w-4"></th>
          </tr>
        </thead>
        <tbody>
          {data.apiKeys.map((apiKey) => (
            <tr key={apiKey.id}>
              <td>{apiKey.name}</td>
              <td>
                <Code>{apiKey.keyHint}</Code>
              </td>
              <td>{apiKey.createdBy.name}</td>
              <td>{GetDateFormatted(apiKey.createdAt)}</td>
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
                  <input type="hidden" name="id" value={apiKey.id} />
                  <input type="hidden" name="type" value="remove" />
                  <ActionIcon color="red" type="submit">
                    <TrashIcon className="h-4 w-4" />
                  </ActionIcon>
                </Form>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {data.apiKeys.length === 0 && (
        <EmptyStateTable>No API keys yet</EmptyStateTable>
      )}

      <Form ref={formRef} method="post">
        <div className="flex gap-2">
          <input type="hidden" name="type" value="add" />
          <TextInput type="text" name="name" placeholder="API key name" />
          <CMButton type="submit">Create API key</CMButton>
        </div>
        {actionData?.error && (
          <div key="name-error" className="text-xs text-red-500">
            {actionData?.error}
          </div>
        )}
      </Form>

      {actionData?.key && actionData?.keySecret && (
        <Notification
          className="w-1/2"
          icon={<CheckIcon className="h-4 w-4" />}
          color="teal"
          title="API key created"
          disallowClose
        >
          Your API key is: <Code>{actionData.keySecret}</Code>{" "}
          <CopyButton value={actionData.keySecret}>
            {({ copied, copy }) => (
              <CMButton
                status={copied ? "allowed" : undefined}
                onClick={copy}
                className=" inline-flex px-1 py-[3px]"
              >
                {copied ? (
                  <CheckIcon className="h3 w-3" />
                ) : (
                  <ClipboardIcon className="h3 w-3" />
                )}
              </CMButton>
            )}
          </CopyButton>{" "}
          this is the only time you will see this key, please save it somewhere
          safe.
        </Notification>
      )}
    </DashboardContainer>
  );
}
