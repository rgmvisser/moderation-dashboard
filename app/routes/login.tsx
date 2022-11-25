import { TextInput, PasswordInput, Paper, Container } from "@mantine/core";
import { Form, useTransition } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { AuthorizationError } from "remix-auth";
import { json, redirect, useActionData } from "remix-supertyped";

import { z } from "zod";
import {
  AuthenticateModerator,
  IsAuthenticated,
} from "~/middleware/authenticate";

import { CMButton } from "~/shared/components/CMButton";
import { useLoadingDelay } from "~/shared/hooks/useLoadingDelay";
import { delay } from "~/shared/utils.tsx/delay";
import { DashboardPath } from "~/shared/utils.tsx/navigation";

export const validator = withZod(
  z.object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email("Please enter a valid email"),
    password: z.string().min(1, { message: "Password is required" }),
  })
);

export async function action({ request }: ActionArgs) {
  const clonedRequest = request.clone();
  const formData = await clonedRequest.formData();
  const result = await validator.validate(formData);

  if (result.error) {
    return json({
      error: new Error(Object.values(result.error.fieldErrors).join(", ")),
    });
  }
  await delay(600); // To make it feel more real
  try {
    return await AuthenticateModerator("email-password", request);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return json({ error });
    }
    throw error;
  }
}

export async function loader({ request }: LoaderArgs) {
  // If the user is already authenticated redirect to /dashboard directly
  const isAuthed = await IsAuthenticated(request);
  if (isAuthed) {
    return redirect(DashboardPath());
  }
  return json({});
}

export default function Login() {
  const actionData = useActionData();
  const transition = useTransition();
  const isLoading = useLoadingDelay(transition.state !== "idle", {
    delay: 0,
  });
  return (
    <Container size={420} className="mt-24">
      {/* <Text color="dimmed" size="sm" align="center" mt={5}>
        Do not have an account yet?{" "}
        <Anchor<"a">
          href="#"
          size="sm"
          onClick={(event) => event.preventDefault()}
        >
          Create account
        </Anchor>
      </Text> */}

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <h1 className="mb-4 text-4xl font-bold">Login</h1>
        <Form method="post">
          <TextInput
            label="Email"
            name="email"
            placeholder="yourname@email.com"
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            name="password"
          />
          {actionData?.error && (
            <div className="mt-2 text-sm text-red-500">
              {actionData.error.message}
            </div>
          )}
          {/* <Group position="apart" mt="lg">
          <Checkbox label="Remember me" sx={{ lineHeight: 1 }} />
          <Anchor<"a">
            onClick={(event) => event.preventDefault()}
            href="#"
            size="sm"
          >
            Forgot password?
          </Anchor>
        </Group> */}
          <CMButton type="submit" className="mt-4 w-full" loading={isLoading}>
            Sign in
          </CMButton>
        </Form>
      </Paper>
    </Container>
  );
}
