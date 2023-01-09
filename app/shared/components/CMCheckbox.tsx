import type { CheckboxProps } from "@mantine/core";
import { Checkbox } from "@mantine/core";
import { useField } from "remix-validated-form";

type Props = {
  name: string;
  isRequired?: boolean;
};

export const CMCheckbox = ({ name, ...rest }: Props & CheckboxProps) => {
  const { getInputProps, error } = useField(name);
  const props = getInputProps({ ...rest });
  const defaultChecked = props.defaultValue;
  delete props.defaultValue; // remove defaultValue from props as this messes with the defaultChecked prop
  return (
    <>
      <Checkbox {...props} defaultChecked={defaultChecked} />
      {error && (
        <div key={error} className="text-xs text-red-500">
          {error}
        </div>
      )}
    </>
  );
};
