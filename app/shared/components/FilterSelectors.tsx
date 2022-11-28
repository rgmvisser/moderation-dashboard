import { MultiSelect } from "@mantine/core";
import { useFetcher } from "@remix-run/react";
import { useRef } from "react";
import type { Filter, FilterInfo } from "~/controllers.ts/filter.server";
import { useTenantContext } from "../contexts/TenantContext";
import { CapitalizeFirst } from "../utils.tsx/strings";

type Props = {
  projects: FilterInfo;
  topics: FilterInfo;
  statuses: FilterInfo;
  filter: Filter;
};

export const Selectors = ({ statuses, projects, topics, filter }: Props) => {
  const tenantContext = useTenantContext();
  const filterFetcher = useFetcher();
  const projectData = GetFormData(projects);
  const topicData = GetFormData(topics);
  const statusData = GetFormData(statuses);
  const formRef = useRef(null);

  function onChange() {
    // Timeout as the stupid onchange still has the old values
    setTimeout(() => {
      filterFetcher.submit(formRef.current);
    }, 50);
  }

  return (
    <filterFetcher.Form
      method="post"
      ref={formRef}
      action={`/${tenantContext.tenant.slug}/settings/filter`}
      reloadDocument
      className="w-full"
    >
      <div className="flex  w-full gap-2">
        <MultiSelect
          data={[...projectData]}
          placeholder="Select Projects"
          name="projects"
          onChange={onChange}
          defaultValue={filter.projects}
          className="flex-grow"
        />
        <MultiSelect
          data={[...topicData]}
          placeholder="Select Topics"
          name="topics"
          onChange={onChange}
          className="flex-grow"
          defaultValue={filter.topics}
        />
        <MultiSelect
          data={[...statusData]}
          placeholder="Select Statuses"
          name="statuses"
          onChange={onChange}
          className="flex-grow"
          defaultValue={filter.statuses}
        />
      </div>
    </filterFetcher.Form>
  );
};

function GetFormData(list: FilterInfo) {
  return list.map((s) => {
    return { label: CapitalizeFirst(s.name), value: s.id };
  });
}
