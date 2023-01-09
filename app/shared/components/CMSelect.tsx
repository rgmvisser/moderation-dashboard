import type { SelectProps } from "@mantine/core";
import { Select } from "@mantine/core";
import { useField } from "remix-validated-form";

type Props = {
  name: string;
  isRequired?: boolean;
};

export const CMSelect = ({ name, data, ...rest }: Props & SelectProps) => {
  const { getInputProps, error } = useField(name);
  const props = getInputProps({ ...rest });
  // Somehow resetting of the form is not working
  return (
    <>
      <Select {...props} data={data} />
      {error && (
        <div key={error} className="text-xs text-red-500">
          {error}
        </div>
      )}
    </>
  );
};
