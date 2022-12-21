import {
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  PlusCircleIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Checkbox, Collapse } from "@mantine/core";
import { Status } from "@prisma/client";
import { Form } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import classNames from "classnames";
import { useState } from "react";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { StatusBadge } from "~/shared/components/CMBadge";
import { CMButton } from "~/shared/components/CMButton";
import { CMIconButton } from "~/shared/components/CMIconButton";
import { CMTextInput } from "~/shared/components/CMInput";
import { CMSelect } from "~/shared/components/CMSelect";
import { Box, Container, Header } from "~/shared/components/DashboardContainer";
import { useTenantContext } from "~/shared/contexts/TenantContext";
import { ActionTextFromStatus } from "~/shared/utils.tsx/status";

export default function ContentRules() {
  return (
    <Container>
      <Header title="Content Rules" />
      <div className="flex flex-col gap-2">
        <RuleBox
          number={1}
          name={"Allow admin users"}
          action={"allowed"}
          reason="Internal use"
          total={5}
        ></RuleBox>
        <RuleBox
          number={2}
          name={"Flag user content"}
          action={"flagged"}
          reason="Inherit from user"
          total={5}
        ></RuleBox>
        <RuleBox
          number={3}
          name={"Hide user content"}
          action={"hidden"}
          reason="Inherit from user"
          total={5}
        ></RuleBox>
        <RuleBox
          number={4}
          name={"Filter bad words"}
          action={"hidden"}
          reason="Inappropriate content"
          total={5}
        ></RuleBox>
        <RuleBox
          number={5}
          name={"Filter bad topics"}
          action={"hidden"}
          reason="Inappropriate content"
          total={5}
        ></RuleBox>
      </div>
    </Container>
  );
}

type RuleBoxProps = {
  number: number;
  name: string;
  action: Status;
  reason: string;
  total: number;
};

export const ruleValidator = withZod(
  z.object({
    name: z.string(),
  })
);

const RuleBox = ({ number, name, action, reason, total }: RuleBoxProps) => {
  const tenantContext = useTenantContext();
  const [isOpen, setIsOpen] = useState(number === 1);
  const [selectedAction, setSelectedAction] = useState(action);
  const [conditions, setConditions] = useState(["a", "b", "c"]);
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
          <div className="grow font-semibold">{name}</div>
          <div className="flex items-center gap-1">
            <span className="font-semibold">Action:</span>{" "}
            <StatusBadge status={action} verb />
          </div>

          <div className="w-56 truncate">
            <span className="font-semibold">Reason:</span> {reason}
          </div>
        </div>

        <div className="flex w-10 items-center justify-end">
          {number !== 1 ? (
            <button>
              <ArrowUpCircleIcon className="h-5 w-5" />
            </button>
          ) : null}
          {number !== total ? (
            <button>
              <ArrowDownCircleIcon className="h-5 w-5" />
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
                defaultValue={name}
                className="max-w-sm"
              />
              <div className="flex flex-col gap-2">
                <h2 className=" font-semibold">Conditions</h2>
                <div className="flex flex-col gap-2">
                  {conditions.map((condition) => (
                    <Condition
                      allowRemoval={conditions.length > 1}
                      condition={condition}
                      key={condition}
                      onRemove={(rmc) =>
                        setConditions((conditions) => [
                          ...conditions.filter((c) => c !== rmc),
                        ])
                      }
                    />
                  ))}
                </div>
                <div className="flex flex-col items-end p-1">
                  <CMIconButton variant="positive" type="button">
                    <PlusIcon
                      className="h-4 w-4"
                      onClick={(e) => setConditions((v) => [...v, "a"])}
                    />
                  </CMIconButton>
                </div>
              </div>

              <CMSelect
                name="action"
                label="Action"
                defaultValue={action}
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
                // defaultValue={reason?.id}
              />
              <div className="mt-3 flex flex-col gap-2">
                <h2 className=" font-semibold">Options</h2>
                <Checkbox
                  name="terminateOnMatch"
                  label="Stop ruleset if rule matches"
                />
                <Checkbox
                  name="skipIfAlreadyApplied"
                  label="Skip if rule already has been applied"
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

const Condition = function ({
  condition,
  allowRemoval,
  onRemove,
}: {
  condition: string;
  allowRemoval: boolean;
  onRemove: (condition: string) => void;
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
          <XMarkIcon className="h-4 w-4" onClick={(e) => onRemove(condition)} />
        </CMIconButton>
      )}
    </div>
  );
};
