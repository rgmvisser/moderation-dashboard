import { Checkbox, NumberInput } from "@mantine/core";
import React from "react";
import { useTimerContext } from "../contexts/TimerContext";

export default function Timer() {
  const timerContext = useTimerContext();

  return (
    <div>
      <Checkbox
        defaultChecked={timerContext.enabled}
        onChange={() => timerContext.toggleEnabled()}
        label={"Running"}
      />
      <NumberInput
        defaultValue={timerContext.speed}
        min={1}
        max={100}
        onChange={(number) => timerContext.setSpeed(number ?? 1)}
      />
      <div>Timer: {timerContext.currentTime / 1000}</div>
    </div>
  );
}
