import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import type { TextInputProps } from "@mantine/core";
import { TextInput } from "@mantine/core";
import debounce from "lodash.debounce";
import { useEffect, useRef } from "react";

interface DebouncedInputProps extends TextInputProps {
  onDebounceChange: (value: string) => void;
}

export const DebouncedInput = ({
  onDebounceChange,
  ...rest
}: DebouncedInputProps) => {
  const debouncedSearch = useRef(
    debounce(async (text: string) => {
      onDebounceChange(text);
    }, 300)
  ).current;

  // Cancel any pending debounced search when the component unmounts
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);
  return (
    <TextInput {...rest} onChange={(e) => debouncedSearch(e.target.value)} />
  );
};
