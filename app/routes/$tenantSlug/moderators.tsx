import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, useActionData, useLoaderData } from "remix-supertyped";
import { GetDateFormatted } from "~/shared/utils.tsx/date";
import { GetModeratorAndTenant, GetTenant } from "~/middleware/tenant";
import { ActionIcon, Modal, Table } from "@mantine/core";
import { Form, useTransition } from "@remix-run/react";
import { CMButton } from "~/shared/components/CMButton";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { EmptyStateTable } from "~/shared/components/EmptyStateTable";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { Role } from "@prisma/client";
import { ModeratorController } from "~/controllers/moderator.server";
import DashboardContainer from "~/shared/components/DashboardContainer";
import { Roles } from "~/models/moderator";
import { CapitalizeFirst } from "~/shared/utils.tsx/strings";
import { useLoadingDelay } from "~/shared/hooks/useLoadingDelay";
import { ValidatedForm, validationError } from "remix-validated-form";
import { CMTextInput } from "~/shared/components/CMInput";
import { CMSelect } from "~/shared/components/CMSelect";
import { CMNotificationProvider } from "~/shared/components/CMNotificationProvider";
import { IsAdmin } from "~/models/roles";
import { useTenantContext } from "~/shared/contexts/TenantContext";
import { ModeratorAdminController } from "~/controllers/moderatorAdmin.server";
import { CMError } from "~/models/error";

export const postValidator = withZod(
  z.union([
    z.object({
      action: z.literal("updateRole"),
      id: z.string().cuid(),
      role: z.nativeEnum(Role, {
        errorMap: (issue, ctx) => {
          return { message: "Please select a role" };
        },
      }),
    }),
    z.object({
      action: z.literal("remove"),
      id: z.string().cuid(),
    }),
    z
      .object({
        action: z.literal("add"),
        name: z.string().min(3).max(100),
        email: z.string().email(),
        password: z.string().min(3).max(100),
        confirmPassword: z.string().min(3).max(100),
        role: z.nativeEnum(Role, {
          errorMap: (issue, ctx) => {
            return { message: "Please select a role" };
          },
        }),
      })
      .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
          ctx.addIssue({
            code: "custom",
            message: "The passwords did not match",
          });
        }
      }),
  ])
);
export async function action({ request, params }: ActionArgs) {
  const { tenant, moderator } = await GetModeratorAndTenant(
    request,
    params,
    Role.admin
  );
  const res = await postValidator.validate(await request.formData());
  if (res.error) {
    return validationError(res.error);
  }
  const { action } = res.data;
  if (action === "add") {
    const { name, role, email, password } = res.data;
    try {
      const moderator = await ModeratorController.CreateModerator(tenant, {
        name,
        password,
        email,
        role,
      });
      return json({ moderator, notification: `Added ${name} as moderator` });
    } catch (error: any) {
      if (error.code === "P2002") {
        return validationError(
          {
            fieldErrors: {
              email: "This email is already in use",
            },
            // You can also provide a `formId` instead of a `subaction`
            // if your form has an `id` prop
            formId: res.formId,
          },
          res.data
        );
      } else if (CMError.ModeratorAlreadyPartOfTenant.equals(error)) {
        return json({ error: error.message });
      }

      console.error(error);
      return json({ error: "Something went wrong, please try again later" });
    }
  } else if (action === "remove") {
    const moderatorAdminController = new ModeratorAdminController(moderator);
    const { id } = res.data;
    await moderatorAdminController.deleteModerator(id);
    return json({ notification: "Moderator removed" });
  } else if (action === "updateRole") {
    const moderatorAdminController = new ModeratorAdminController(moderator);
    const { id, role } = res.data;
    await moderatorAdminController.updateRole(id, role);
    return json({ notification: "Moderator's role update to: " + role });
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
  const tenantContext = useTenantContext();
  const data = useLoaderData<typeof loader>();
  const [addModeratorOpened, setAddModeratorOpened] = useState(false);
  const transition = useTransition();
  const isLoading = useLoadingDelay(transition.state !== "idle", {
    delay: 0,
  });
  const actionData = useActionData();
  const { moderators } = data;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmedPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState<string | null>(
    null
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (
      password.length === 0 ||
      confirmPassword.length === 0 ||
      password === confirmPassword
    ) {
      setPasswordMatchError(null);
    } else {
      setPasswordMatchError("Passwords do not match");
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    if (actionData && !actionData.error && !actionData.fieldErrors) {
      formRef.current?.reset();
      setAddModeratorOpened(false);
    }
  }, [actionData]);
  const isAdmin = IsAdmin(tenantContext.tenant, tenantContext.moderator);

  return (
    <CMNotificationProvider notification={actionData?.notification}>
      <DashboardContainer
        title="Moderators"
        rightItem={
          <CMButton onClick={() => setAddModeratorOpened(true)}>
            + Moderator
          </CMButton>
        }
      >
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              {isAdmin && <th></th>}
            </tr>
          </thead>
          <tbody>
            {moderators.map((moderator) => (
              <tr key={moderator.id}>
                <td>{moderator.name}</td>
                <td>{moderator.email}</td>
                <td>
                  {isAdmin && moderator.id != tenantContext.moderator.id ? (
                    <Form method="post">
                      <input type="hidden" name="id" value={moderator.id} />
                      <input type="hidden" name="action" value="updateRole" />
                      <select
                        name="role"
                        placeholder={`Select a role`}
                        onChange={(e) => {
                          e.target.form?.submit();
                        }}
                        defaultValue={moderator.roles[0].role}
                      >
                        {Roles.map((role) => (
                          <option value={role} key={role}>
                            {CapitalizeFirst(role)}
                          </option>
                        ))}
                      </select>
                    </Form>
                  ) : (
                    moderator.roles[0].role
                  )}
                </td>
                <td>{GetDateFormatted(moderator.createdAt)}</td>
                <td>
                  {isAdmin && moderator.id != tenantContext.moderator.id && (
                    <Form
                      method="post"
                      onSubmit={(event) => {
                        if (
                          !confirm(
                            "Are you sure? This action cannot be undone."
                          )
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
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {moderators.length === 0 && (
          <EmptyStateTable>No moderators yet</EmptyStateTable>
        )}

        <Modal
          opened={addModeratorOpened}
          onClose={() => setAddModeratorOpened(false)}
          title={<h2>Add Moderator</h2>}
        >
          <ValidatedForm ref={formRef} validator={postValidator} method="post">
            <div className="flex flex-col gap-2">
              <input name="action" type="hidden" value="add" readOnly />

              <CMTextInput name="name" label="Name" />
              <CMTextInput name="email" label="Email" />
              <CMTextInput
                name="password"
                label="Password"
                type={"password"}
                onChange={(e) => setPassword(e.target.value)}
              />
              <CMTextInput
                name="confirmPassword"
                label="Confrim password"
                type="password"
                onChange={(e) => setConfirmedPassword(e.target.value)}
              />
              {passwordMatchError && (
                <div
                  key={"passwordMatchError"}
                  className="text-xs text-red-500"
                >
                  {passwordMatchError}
                </div>
              )}

              <CMSelect
                name="role"
                label={`Role`}
                placeholder={`Select a role`}
                data={Roles.map((role) => ({
                  label: CapitalizeFirst(role),
                  value: role,
                }))}
              />

              <CMButton type="submit" loading={isLoading}>
                {isLoading ? "Creating" : "Create Moderator"}
              </CMButton>
              {actionData?.error && (
                <div key={"generalError"} className="text-xs text-red-500">
                  {actionData.error}
                </div>
              )}
            </div>
          </ValidatedForm>
        </Modal>
      </DashboardContainer>
    </CMNotificationProvider>
  );
}
