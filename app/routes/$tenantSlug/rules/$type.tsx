import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Checkbox, Collapse } from "@mantine/core";
import type { Condition } from "@prisma/client";
import { Status } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import classNames from "classnames";
import { useState } from "react";
import { json, redirect, useLoaderData } from "remix-supertyped";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { RulesController } from "~/controllers/rules.server";
import { GetModeratorAndTenant } from "~/middleware/tenant";
import type { PartialCondition } from "~/models/condition";
import { NewCondition } from "~/models/condition";
import type { RuleWithReasonAndCondions } from "~/models/rule";
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
import { ActionTextFromStatus } from "~/shared/utils.tsx/status";

export async function loader({ request, params }: LoaderArgs) {
  const { tenant } = await GetModeratorAndTenant(request, params);
  const type = params.type as "user" | "content";
  if (type !== "user" && type !== "content") {
    return redirect("/rules");
  }
  const rulesController = new RulesController(tenant);
  const rules = await rulesController.getRules(type);
  return json({ rules });
}

export default function ContentRules() {
  const { rules } = useLoaderData<typeof loader>();
  return (
    <Container>
      <Header
        title="Content Rules"
        rightItem={<CMButton type="button">+ Rule</CMButton>}
      />
      <div className="flex flex-col gap-2">
        {rules.map((rule, index) => (
          <RuleBox
            key={rule.id}
            number={index + 1}
            total={rules.length}
            rule={rule}
          ></RuleBox>
        ))}
      </div>
    </Container>
  );
}

type RuleBoxProps = {
  number: number;
  total: number;
  rule: RuleWithReasonAndCondions;
};

export const ruleValidator = withZod(
  z.object({
    name: z.string(),
  })
);

const RuleBox = ({ number, total, rule }: RuleBoxProps) => {
  const tenantContext = useTenantContext();
  const [isOpen, setIsOpen] = useState(number === 3);
  const [selectedAction, setSelectedAction] = useState(rule.reason.status);
  const [conditions, setConditions] = useState<
    (Condition | PartialCondition)[]
  >(rule.conditions);
  return (
    <Box className="p-0 px-4">
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
              <StatusBadge status={rule.reason.status} verb />
            </span>
          </div>

          <div className="w-56 truncate">
            <span className="font-semibold">Reason:</span>{" "}
            {rule.reason.reasonId}
          </div>
        </div>

        <div className="flex w-10 items-center justify-end">
          {number !== 1 ? (
            <button>
              <UpIcon />
            </button>
          ) : null}
          {number !== total ? (
            <button>
              <DownIcon />
            </button>
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
        <ValidatedForm validator={ruleValidator}>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex  flex-col gap-2">
              <input name="ruleid" type="hidden" value="" readOnly />
              <CMTextInput
                name="name"
                label="Name"
                defaultValue={rule.name}
                className="max-w-sm"
              />
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
                          ...conditions.filter(
                            (c) => c.id !== removeConditionId
                          ),
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
                defaultValue={rule.reason.status}
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
                type="button"
                variant="secondary"
                onClick={(e) => setIsOpen(false)}
              >
                Cancel
              </CMButton>
              <CMButton type="button" onClick={(e) => setIsOpen(false)}>
                Save
              </CMButton>
            </div>
          </div>
        </ValidatedForm>
      </Collapse>
    </Box>
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
