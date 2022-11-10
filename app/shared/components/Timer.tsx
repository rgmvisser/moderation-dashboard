import { Checkbox, NumberInput } from "@mantine/core";
import { useFetcher } from "@remix-run/react";
import React, { useRef } from "react";

export default function Timer() {
  const timer = useFetcher();
  const { speed, enabled } = (timer.data ?? { speed: 1, enabled: true }) as {
    speed: number;
    enabled: boolean;
  };
  const formRef = useRef(null);

  return (
    <timer.Form method="post" action="/settings/timer" ref={formRef}>
      <div>
        <Checkbox
          defaultChecked={enabled}
          onChange={(event) => timer.submit(formRef.current)}
          label={"Running"}
          name={"enabled"}
        />
        <NumberInput
          defaultValue={speed}
          min={1}
          max={100}
          onChange={(number) => {
            // Stupid bug where the value of the input is still the old value, so just delay a bit
            setTimeout(() => timer.submit(formRef.current), 50);
          }}
          name={"speed"}
        />
      </div>
    </timer.Form>
  );
}
