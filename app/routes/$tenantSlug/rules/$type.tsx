import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Checkbox, Collapse } from "@mantine/core";
import type { Condition } from "@prisma/client";
import { Status } from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { Form } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { json, redirect, useActionData, useLoaderData } from "remix-supertyped";
import {
  useFormContext,
  ValidatedForm,
  validationError,
} from "remix-validated-form";
import { z } from "zod";
import { RulesController } from "~/controllers/rules.server";
import { GetModeratorAndTenant } from "~/middleware/tenant";
import type { PartialCondition } from "~/models/condition";
import { NewCondition } from "~/models/condition";
import type { RuleWithReasonAndCondions } from "~/models/rule";
import { Directions } from "~/models/rule";
import { StatusBadge } from "~/shared/components/CMBadge";
import { CMButton } from "~/shared/components/CMButton";
import { CMIconButton } from "~/shared/components/CMIconButton";
import { CMTextInput } from "~/shared/components/CMInput";
import { CMSelect } from "~/shared/components/CMSelect";
import { Box, Container, Header } from "~/shared/components/DashboardContainer";
import {
  DownIcon,
  SkipIcon,
  TerminateIcon,
  UpIcon,
} from "~/shared/components/Icons";
import { useTenantContext } from "~/shared/contexts/TenantContext";
import { RulesPath } from "~/shared/utils.tsx/navigation";
import { ActionTextFromStatus } from "~/shared/utils.tsx/status";
import { Flipper, Flipped } from "react-flip-toolkit";
import { zx } from "zodix";
import { CMHiddenInput } from "~/shared/components/CMHiddenInput";
import { CMNotificationProvider } from "~/shared/components/CMNotificationProvider";

const ruleObject = z.object({
  subaction: z.literal("save"),
  ruleId: z.union([z.string().cuid(), z.literal("")]),
  name: z.string().min(1),
  action: z.nativeEnum(Status),
  reasonId: z.string().cuid(),
  terminateOnMatch: zx.CheckboxAsString,
  skipIfAlreadyApplied: zx.CheckboxAsString,
});

export const validator = withZod(
  z.union([
    z.object({
      direction: z.enum(Directions),
      subaction: z.literal("move"),
      ruleId: z.string().cuid(),
    }),
    ruleObject,
  ])
);

// TODO: Work on conditions in the rules

const GetType = (params: Params) => {
  const type = params.type as "user" | "content";
  if (type !== "user" && type !== "content") {
    throw redirect(RulesPath(params.tenantSlug ?? ""));
  }
  return type;
};

export async function action({ request, params }: ActionArgs) {
  const type = GetType(params);
  const { tenant } = await GetModeratorAndTenant(request, params);
  const clonedRequest = request.clone();
  const formData = await clonedRequest.formData();
  const result = await validator.validate(formData);
  if (result.error) {
    return validationError(result.error);
  }
  const rulesController = new RulesController(tenant);
  const { subaction } = result.data;
  let notification: string | undefined = undefined;
  let updatedRule: RuleWithReasonAndCondions | undefined = undefined;
  console.log(result.data);
  if (subaction === "move") {
    const { ruleId, direction } = result.data;
    await rulesController.moveRule(ruleId, direction);
  } else if (subaction === "save") {
    const {
      ruleId,
      name,
      action,
      reasonId,
      terminateOnMatch,
      skipIfAlreadyApplied,
    } = result.data;
    console.log(result.data);
    if (ruleId) {
      updatedRule = await rulesController.updateRule(
        ruleId,
        name,
        action,
        reasonId,
        terminateOnMatch,
        skipIfAlreadyApplied,
        []
      );
      notification = "Rule updated";
    } else {
      updatedRule = await rulesController.createRule(
        name,
        type,
        action,
        reasonId,
        terminateOnMatch,
        skipIfAlreadyApplied,
        []
      );
      notification = "Rule created";
    }
  }
  const rules = await rulesController.getRules(type);
  return json({ rules, notification, updatedRule });
}

export async function loader({ request, params }: LoaderArgs) {
  const { tenant } = await GetModeratorAndTenant(request, params);
  const type = GetType(params);
  const rulesController = new RulesController(tenant);
  const rules = await rulesController.getRules(type);
  return json({ rules });
}

export default function ContentRules() {
  const { rules } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  let notification;
  let updateRule: RuleWithReasonAndCondions | undefined;
  if (actionData && !("fieldErrors" in actionData)) {
    notification = actionData.notification;
    updateRule = actionData.updatedRule;
    console.log(updateRule);
  }

  return (
    <CMNotificationProvider notification={notification}>
      <Container>
        <Header
          title="Content Rules"
          rightItem={<CMButton type="button">+ Rule</CMButton>}
        />
        <div>
          <Flipper
            flipKey={rules.map((r) => r.id).join("-")}
            className="flex flex-col gap-2"
            // This somehow doesn't work yet, but don't wanna spend too much time on this
          >
            {rules.map((rule, index) => (
              <Flipped key={rule.id} flipId={rule.id}>
                <RuleBox
                  number={index + 1}
                  total={rules.length}
                  rule={rule}
                ></RuleBox>
              </Flipped>
            ))}
          </Flipper>
        </div>
      </Container>
    </CMNotificationProvider>
  );
}

type RuleBoxProps = {
  number: number;
  total: number;
  rule: RuleWithReasonAndCondions;
};

export const ruleValidator = withZod(ruleObject);

const RuleBox = ({ number, total, rule }: RuleBoxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(rule.updatedAt);
  useEffect(() => {
    if (lastUpdated < rule.updatedAt) {
      setIsOpen(false);
      setLastUpdated(rule.updatedAt);
    }
  }, [lastUpdated, rule]);
  return (
    <Box className="p-0 px-4" id={rule.id}>
      <div
        className={classNames(
          "flex flex-row items-center",
          "transition-opacity",
          isOpen ? "hidden opacity-0" : "opacity-100"
        )}
      >
        <div
          className="flex grow cursor-pointer flex-row items-center gap-2 py-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-full border border-main bg-slate-50 text-center text-xs font-semibold ">
            {number}
          </div>
          <div className="grow font-semibold">{rule.name}</div>
          {rule.skipIfAlreadyApplied && (
            <div>
              <SkipIcon />
            </div>
          )}
          {rule.terminateOnMatch && (
            <div>
              <TerminateIcon />
            </div>
          )}
          <div className="flex items-center">
            <span className="font-semibold">Action:</span>{" "}
            <span className="flex w-16 flex-row items-center justify-center">
              <StatusBadge status={rule.action} verb />
            </span>
          </div>

          <div className="w-56 truncate">
            <span className="font-semibold">Reason:</span>{" "}
            <span className="text-sm">{rule.reason.name}</span>
          </div>
        </div>

        <div className="flex w-10 items-center justify-end">
          {number !== 1 ? (
            <Form method="post">
              <input type="hidden" name="subaction" value="move" />
              <input type="hidden" name="direction" value="up" />
              <input type="hidden" name="ruleId" value={rule.id} />
              <button>
                <UpIcon />
              </button>
            </Form>
          ) : null}
          {number !== total ? (
            <Form method="post">
              <input type="hidden" name="subaction" value="move" />
              <input type="hidden" name="direction" value="down" />
              <input type="hidden" name="ruleId" value={rule.id} />
              <button>
                <DownIcon />
              </button>
            </Form>
          ) : null}
        </div>
      </div>
      <Collapse
        in={isOpen}
        className={classNames(
          "transition-opacity",
          isOpen ? "opacity-100" : "opacity-0"
        )}
      >
        <EditRuleForm rule={rule} setIsOpen={setIsOpen} />
      </Collapse>
    </Box>
  );
};

const EditRuleForm = function ({
  rule,
  setIsOpen,
}: {
  rule: RuleWithReasonAndCondions;
  setIsOpen: (open: boolean) => void;
}) {
  const tenantContext = useTenantContext();
  const [selectedAction, setSelectedAction] = useState(rule.action);
  const [conditions, setConditions] = useState<
    (Condition | PartialCondition)[]
  >(rule.conditions);
  // const context = useFormContext(`edit-rule-form-${rule.id}`);
  // useEffect(() => {
  //   console.log(context);
  // }, [context]);

  return (
    <ValidatedForm
      id={`edit-rule-form-${rule.id}`}
      subaction="save"
      validator={ruleValidator}
      defaultValues={{
        ruleId: rule.id,
        name: rule.name,
        action: rule.action,
        reasonId: rule.reason.id,
        terminateOnMatch: rule.terminateOnMatch,
        skipIfAlreadyApplied: rule.skipIfAlreadyApplied,
      }}
      onSubmit={(values) => {
        console.log("Submit:", values);
      }}
      method="post"
    >
      <div className="flex flex-col gap-4 py-4">
        <div className="flex  flex-col gap-2">
          <CMHiddenInput name="ruleId" />
          <CMTextInput name="name" label="Name" className="max-w-sm" />
          <div className="flex flex-col gap-2">
            <h2 className=" font-semibold">Conditions</h2>
            <div className="flex flex-col gap-2">
              {conditions.map((condition) => (
                <ConditionRow
                  allowRemoval={conditions.length > 1}
                  condition={condition}
                  key={condition.id}
                  onRemove={(removeConditionId) =>
                    setConditions((conditions) => [
                      ...conditions.filter((c) => c.id !== removeConditionId),
                    ])
                  }
                />
              ))}
            </div>
            <div className="flex flex-col items-end p-1">
              <CMIconButton variant="positive" type="button">
                <PlusIcon
                  className="h-4 w-4"
                  onClick={(e) =>
                    setConditions((v) => [
                      ...v,
                      NewCondition(rule, tenantContext.tenant.id),
                    ])
                  }
                />
              </CMIconButton>
            </div>
          </div>

          <CMSelect
            name="action"
            label="Action"
            data={Object.values(Status).map((status) => ({
              label: ActionTextFromStatus(status),
              value: status,
            }))}
            onChange={(value) => setSelectedAction(value as Status)}
            className="-mt-8 max-w-sm"
          />

          <CMSelect
            name="reasonId"
            label={`Reason`}
            placeholder={`Select reason for`}
            data={tenantContext.reasons[selectedAction].map((reason) => ({
              label: reason.name,
              value: reason.id,
            }))}
            searchable
            creatable
            getCreateLabel={(query) => `+ Create ${query}`}
            onCreate={(query) => {
              const item = { value: query.toLowerCase(), label: query };
              // setData((current) => [...current, item]);
              return item;
            }}
            className="max-w-sm"
            defaultValue={rule.reason.id}
          />
          <div className="mt-3 flex flex-col gap-2">
            <h2 className=" font-semibold">Options</h2>
            <Checkbox
              name="terminateOnMatch"
              label={
                <span className="flex flex-row items-center gap-1">
                  Stop ruleset if rule matches
                  <TerminateIcon />
                </span>
              }
              defaultChecked={rule.terminateOnMatch}
            />
            <Checkbox
              name="skipIfAlreadyApplied"
              label={
                <span className="flex flex-row items-center gap-1">
                  Skip if rule already has been applied
                  <SkipIcon />
                </span>
              }
              defaultChecked={rule.skipIfAlreadyApplied}
            />
          </div>
        </div>
        <div className=" flex flex-row items-center justify-end gap-1">
          <CMButton
            type="reset"
            variant="secondary"
            onClick={(e) => {
              setIsOpen(false);
            }}
          >
            Cancel
          </CMButton>
          <CMButton type="submit">Save</CMButton>
        </div>
      </div>
    </ValidatedForm>
  );
};

const ConditionRow = function ({
  condition,
  allowRemoval,
  onRemove,
}: {
  condition: Condition | PartialCondition;
  allowRemoval: boolean;
  onRemove: (conditionId: string) => void;
}) {
  return (
    <div className="flex flex-row items-center gap-1 rounded-md border border-mantine p-2">
      <CMSelect
        size="xs"
        name="condition-left[]"
        data={[
          {
            label: "User",
            value: "user",
          },
        ]}
      />
      <CMSelect
        size="xs"
        name="condition-operator[]"
        data={[
          {
            label: "is",
            value: "is",
          },
          {
            label: "is not",
            value: "is not",
          },
        ]}
      />
      <CMSelect
        size="xs"
        name="condition-right[]"
        data={[
          {
            label: "Admin",
            value: "admin",
          },
        ]}
      />
      {allowRemoval && (
        <CMIconButton variant="danger" type="button">
          <XMarkIcon
            className="h-4 w-4"
            onClick={(e) => onRemove(condition.id)}
          />
        </CMIconButton>
      )}
    </div>
  );
};
