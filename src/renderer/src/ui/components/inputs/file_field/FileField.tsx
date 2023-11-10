import {
  Control,
  Controller,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form';
import './style/index.scss';
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
  register: any;
  inputBorder?: boolean;
  className?: string;
}
export default function FileField({
  inputProps,
  label,
  Leading,
  Trailing,
  error,
  controllerProps,
  register,
  inputBorder = false,
  className,
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
          ${className && className}`}
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
                type={'file'}
                {...inputProps}
                className="input-style"
                {...register}
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
