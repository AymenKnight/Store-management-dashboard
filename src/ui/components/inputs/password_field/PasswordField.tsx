import { useState } from 'react';
import './style/index.scss';
import Field from '../field';
import EyePassword from '@components/buttons/eye_password';
import { FieldProps } from '../field/Field';

interface PasswordFieldProps extends Omit<FieldProps, 'type' | 'Trailing'> {
  inputBorder?: boolean;
}
export default function PasswordField({
  controllerProps,
  Leading,
  error,
  inputProps,
  label,
  inputBorder,
}: PasswordFieldProps) {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const type = isPasswordVisible ? 'text' : 'password';
  return (
    <Field
      type={type}
      label={label}
      Leading={Leading}
      error={error}
      controllerProps={controllerProps}
      inputProps={inputProps}
      inputBorder={inputBorder}
      Trailing={
        <EyePassword
          value={isPasswordVisible}
          onPress={() => setPasswordVisible(!isPasswordVisible)}
        />
      }
    />
  );
}
