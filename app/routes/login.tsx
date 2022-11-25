import { TextInput, PasswordInput, Paper, Container } from "@mantine/core";
import { Form, useTransition } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { json, redirect, useActionData } from "remix-supertyped";
import { ValidatedForm, validationError } from "remix-validated-form";
import useSpinDelay from "spin-delay";
import { z } from "zod";
import {
  AuthenticateModerator,
  IsAuthenticated,
} from "~/middleware/authenticate";

import { CMButton } from "~/shared/components/CMButton";
import { DashboardPath } from "~/shared/utils.tsx/navigation";

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const validator = withZod(
  z.object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email("Must be a valid email"),
    password: z.string().min(3, { message: "Password is required" }),
  })
);

export async function action({ request }: ActionArgs) {
  const result = await validator.validate(await request.formData());
  if (result.error) {
    return validationError(result.error);
  }

  await AuthenticateModerator("email-password", request);
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
  const transition = useTransition();
  const isLoading = transition.state !== "idle";
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
        <ValidatedForm validator={validator} method="post">
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
        </ValidatedForm>
      </Paper>
    </Container>
  );
}
