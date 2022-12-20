import type { SelectProps } from "@mantine/core";
import { Select } from "@mantine/core";
import { useField } from "remix-validated-form";

type Props = {
  name: string;
  isRequired?: boolean;
};

export const CMSelect = ({ name, ...rest }: Props & SelectProps) => {
  const { getInputProps, error } = useField(name);

  return (
    <>
      <Select
        {...getInputProps({
          id: name,
          ...rest,
        })}
      />
      {error && (
        <div key={error} className="text-xs text-red-500">
          {error}
        </div>
      )}
    </>
  );
};
