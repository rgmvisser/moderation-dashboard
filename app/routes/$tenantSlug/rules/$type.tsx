import { PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ActionIcon, Collapse } from "@mantine/core";
import type { Condition } from "@prisma/client";
import { Status } from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { Form } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { json, redirect, useActionData, useLoaderData } from "remix-supertyped";
import { ValidatedForm, validationError } from "remix-validated-form";
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
import { CMHiddenInput } from "~/shared/components/CMHiddenInput";
import type { CMNotification } from "~/shared/components/CMNotificationProvider";
import { CMNotificationProvider } from "~/shared/components/CMNotificationProvider";
import { CMCheckbox } from "~/shared/components/CMCheckbox";
import { CheckboxAsString } from "zodix";

const ruleObject = z.object({
  subaction: z.enum(["update", "delete"]),
  ruleId: z.string().cuid(),
  name: z.string().min(1),
  action: z.nativeEnum(Status),
  reasonIdOrName: z.union([z.string().min(1), z.string().cuid()]),
  terminateOnMatch: CheckboxAsString,
  skipIfAlreadyApplied: CheckboxAsString,
});

const createRuleObject = z.object({
  subaction: z.literal("new"),
});

const deleteRuleObject = z.object({
  subaction: z.literal("delete"),
  ruleId: z.string().cuid(),
});

export const validator = withZod(
  z.union([
    z.object({
      direction: z.enum(Directions),
      subaction: z.literal("move"),
      ruleId: z.string().cuid(),
    }),
    ruleObject,
    createRuleObject,
    deleteRuleObject,
  ])
);

export const newRuleValidator = withZod(createRuleObject);
export const deleteRuleValidator = withZod(deleteRuleObject);

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
  let notification: CMNotification | undefined = undefined;
  let createdRule: RuleWithReasonAndCondions | undefined = undefined;
  if (subaction === "move") {
    const { ruleId, direction } = result.data;
    await rulesController.moveRule(ruleId, direction);
  } else if (subaction === "update") {
    const {
      ruleId,
      name,
      action,
      reasonIdOrName,
      terminateOnMatch,
      skipIfAlreadyApplied,
    } = result.data;
    await rulesController.updateRule(
      ruleId,
      name,
      action,
      reasonIdOrName,
      terminateOnMatch,
      skipIfAlreadyApplied,
      []
    );
    notification = { id: ruleId, title: "Rule updated" };
  } else if (subaction === "new") {
    createdRule = await rulesController.createRule(
      "New Rule",
      type,
      Status.allowed
    );
    notification = { id: createdRule.id, title: "Rule created" };
  } else if (subaction === "delete") {
    const { ruleId } = result.data;
    await rulesController.deleteRule(ruleId);
    notification = { id: ruleId, title: "Rule deleted" };
  }
  const rules = await rulesController.getRules(type);
  return json({ rules, notification, createdRule });
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
  let createdRule: RuleWithReasonAndCondions | undefined;
  if (actionData && !("fieldErrors" in actionData)) {
    notification = actionData.notification;
    createdRule = actionData.createdRule;
  }

  return (
    <CMNotificationProvider notification={notification}>
      <Container>
        <Header
          title="Content Rules"
          rightItem={
            <ValidatedForm
              validator={newRuleValidator}
              subaction="new"
              method="post"
            >
              <CMButton type="submit">+ Rule</CMButton>
            </ValidatedForm>
          }
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
                  open={createdRule?.id === rule.id}
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
  open?: boolean;
};

export const ruleValidator = withZod(ruleObject);

const RuleBox = ({ number, total, rule, open = false }: RuleBoxProps) => {
  const [isOpen, setIsOpen] = useState(open);
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
  const [subaction, setSubaction] = useState<"update" | "delete">("update");
  const [selectedAction, setSelectedAction] = useState(rule.action);
  const [conditions, setConditions] = useState<
    (Condition | PartialCondition)[]
  >(rule.conditions);
  const [possibleReasons, setPossibleReasons] = useState<
    { name: string; id: string }[]
  >([]);
  useEffect(() => {
    setPossibleReasons(tenantContext.reasons[selectedAction]);
  }, [selectedAction, tenantContext.reasons]);
  // const context = useFormContext(`edit-rule-form-${rule.id}`);
  // useEffect(() => {
  //   console.log(context);
  //   console.log(JSON.stringify(Object.fromEntries(context.getValues())));
  // }, [context]);

  return (
    <ValidatedForm
      id={`edit-rule-form-${rule.id}`}
      validator={ruleValidator}
      defaultValues={{
        ruleId: rule.id,
        name: rule.name,
        action: rule.action,
        reasonIdOrName: rule.reason.id,
        terminateOnMatch: rule.terminateOnMatch,
        skipIfAlreadyApplied: rule.skipIfAlreadyApplied,
      }}
      method="post"
      onSubmit={(data, event) => {
        if (
          data.subaction === "delete" &&
          !confirm("Are you sure? This action cannot be undone.")
        ) {
          event.preventDefault();
        }
      }}
    >
      <CMHiddenInput name="ruleId" />
      <CMHiddenInput name="subaction" value={subaction} />
      <div
        className="h-4 cursor-pointer"
        onClick={() => setIsOpen(false)}
      ></div>
      <div className="flex flex-col gap-4 pb-4">
        <div className="flex  flex-col gap-2">
          <CMTextInput name="name" label="Name" className="max-w-sm" />
          <CMSelect
            name="action"
            label="Action"
            data={Object.values(Status).map((status) => ({
              label: ActionTextFromStatus(status),
              value: status,
            }))}
            onChange={(value) => setSelectedAction(value as Status)}
            className="max-w-sm"
          />
          <CMSelect
            name="reasonIdOrName"
            label={`Reason`}
            placeholder={`Select reason for`}
            data={possibleReasons.map((reason) => ({
              label: reason.name,
              value: reason.id,
            }))}
            searchable
            creatable
            getCreateLabel={(query) => `+ Create ${query}`}
            onCreate={(query) => {
              const item = { id: query, name: query };
              setPossibleReasons((current) => [...current, item]);
              return query;
            }}
            className="max-w-sm"
          />
          <div className="-mb-8 flex flex-col gap-2">
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
          <div className="flex flex-col gap-2">
            <h2 className=" font-semibold">Options</h2>
            <CMCheckbox
              name="terminateOnMatch"
              label={
                <span className="flex flex-row items-center gap-1">
                  Stop ruleset if rule matches
                  <TerminateIcon />
                </span>
              }
              size="sm"
            />
            <CMCheckbox
              name="skipIfAlreadyApplied"
              label={
                <span className="flex flex-row items-center gap-1">
                  Skip if rule already has been applied
                  <SkipIcon />
                </span>
              }
              size="sm"
            />
          </div>
        </div>
        <div className=" flex flex-row items-center justify-end gap-1">
          <ActionIcon
            color="red"
            type="submit"
            onClick={(e: any) => {
              setSubaction("delete");
              e.stopPropagation();
            }}
          >
            <TrashIcon className="h-4 w-4" />
          </ActionIcon>

          <CMButton
            type="reset"
            variant="secondary"
            onClick={(e) => {
              setIsOpen(false);
            }}
          >
            Cancel
          </CMButton>
          <CMButton type="submit" onClick={() => setSubaction("update")}>
            Save
          </CMButton>
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
