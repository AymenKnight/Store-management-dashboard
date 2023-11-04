import {
  Control,
  Controller,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form';
import './style/index.scss';
import color from '@assets/styles/color';

export interface FieldProps<T extends FieldValues = FieldValues> {
  type: React.HTMLInputTypeAttribute;
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
export default function Field({
  type,
  inputProps,
  label,
  Leading,
  Trailing,
  error,
  controllerProps,
  inputBorder = false,
}: FieldProps) {
  return (
    <Controller
      {...controllerProps}
      render={({ field, fieldState }) => (
        <div
          className={`field   ${
            fieldState?.error?.message || error ? 'error' : ''
          } ${inputProps?.disabled ? 'disabled' : ''} 
          ${inputBorder ? 'input-border' : ''}
          `}
        >
          <div
            className="field-wrapper"
            css={{
              paddingLeft: Leading ? 10 : 0,
              paddingRight: Trailing ? 10 : 0,
            }}
          >
            {Leading}
            <div className="input-content">
              {label && <label>{label}</label>}
              <input
                type={type}
                {...inputProps}
                className="input-style"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  inputProps?.onChange && inputProps?.onChange(field.value);
                }}
              />
            </div>
            {Trailing}
          </div>
          {error && <span className="error-span">{error}</span>}
          {fieldState?.error?.message && (
            <span className="error-span">{fieldState?.error?.message}</span>
          )}
        </div>
      )}
    ></Controller>
  );
}
