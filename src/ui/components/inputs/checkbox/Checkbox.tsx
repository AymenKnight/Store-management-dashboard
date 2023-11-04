import {
  Control,
  Controller,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form';
import './style/index.scss';
import { color } from '@assets/styles/color';
export interface FieldProps<T extends FieldValues = FieldValues> {
  inputProps?: React.ClassAttributes<HTMLInputElement> &
    React.InputHTMLAttributes<HTMLInputElement>;
  label?: string;
  Leading?: React.ReactNode;
  Trailing?: React.ReactNode;
  error?: string;
  controllerProps: {
    name: string;
    rules?:
      | Omit<
          RegisterOptions<FieldValues, string>,
          'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
        >
      | undefined;
    defaultValue?: any;
    shouldUnregister?: boolean;
    control?: Control<any>;
  };
  width?: string | number;
  inputBorder?: boolean;
}
export default function Checkbox({
  inputProps,
  label,

  controllerProps,
  inputBorder = false,
}: FieldProps) {
  return (
    <Controller
      {...controllerProps}
      render={({ field, fieldState }) => (
        <div
          className={'checkbox' + (inputProps?.disabled ? ' disabled' : '')}
          css={{
            border: inputBorder ? `1px solid ${color.secondary} ` : undefined,
            padding: inputBorder ? 5 : 0,
            borderRadius: inputBorder ? 7 : 0,
          }}
        >
          <input
            type={'checkbox'}
            {...field}
            checked={field.value}
            onChange={(e) => {
              field.onChange(e.target.checked);
            }}
            id={field.name}
          />
          <label className="label-style" htmlFor={field.name}>
            {label}
          </label>
        </div>
      )}
    ></Controller>
  );
}
