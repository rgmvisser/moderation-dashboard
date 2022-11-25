import { useSpinDelay } from "spin-delay";

export const useLoadingDelay = (
  loading: boolean,
  { minDuration = 200, delay = 400 }
) => {
  return useSpinDelay(loading, {
    minDuration: minDuration,
    delay: delay,
  });
};
