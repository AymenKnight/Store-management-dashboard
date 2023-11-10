import {
  Control,
  Controller,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form';
import './style/index.scss';

export interface FieldProps<T extends FieldValues = FieldValues> {
  type: React.HTMLInputTypeAttribute;
  inputProps?: React.ClassAttributes<HTMLTextAreaElement> &
    React.InputHTMLAttributes<HTMLTextAreaElement>;
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
  defaultValue?: string;
  onSubmit?: () => void;
  placeholder?: string;
}

export default function TextAreaField({
  defaultValue,
  placeholder,
  inputProps,
  label,
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
          <div className="field-wrapper">
            <div className="input-content">
              {label && <label>{label}</label>}
              <div className="text-area">
                <textarea
                  {...inputProps}
                  {...field}
                  placeholder={placeholder}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                />
              </div>
            </div>
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
