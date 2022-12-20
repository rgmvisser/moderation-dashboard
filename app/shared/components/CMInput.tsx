import type { TextInputProps } from "@mantine/core";
import { TextInput } from "@mantine/core";
import { useField } from "remix-validated-form";

type InputProps = {
  name: string;
  label: string;
  isRequired?: boolean;
};

export const CMTextInput = ({ name, ...rest }: InputProps & TextInputProps) => {
  const { getInputProps, error } = useField(name);

  return (
    <>
      <TextInput
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
