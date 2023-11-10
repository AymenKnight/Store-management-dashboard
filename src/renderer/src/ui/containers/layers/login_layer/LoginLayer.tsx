import TextButton from '@components/buttons/text_button';
import './style/index.scss';
import Logo from 'toSvg/logo.svg';
import color from '@assets/styles/color';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Field from '@components/inputs/field';
import PasswordField from '@components/inputs/password_field';
import axiosClient from '@services/api/axios';
import { useAuthStore } from '@services/zustand/authStore';
import { useState } from 'react';
import { CustomError } from '@libs/CustomError';
import ErrorAlert from '@components/error_alert';
import RecoverModal from '@containers/modals/recover_modal';
import { useOverlayStore } from '@services/zustand/overlayStore';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

type Inputs = z.infer<typeof schema>;

interface LoginLayerProps {}
export default function LoginLayer({}: LoginLayerProps) {
  const [err, setErr] = useState<CustomError | undefined>(undefined);
  const authStore = useAuthStore();
  const { modal, close } = useOverlayStore();

  const { control, handleSubmit } = useForm<Inputs>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    resolver: zodResolver(schema),
  });
  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    try {
      await axiosClient.post('/auth/signIn', formData).then((response: any) => {
        if (response && response.data.role == 'ADMIN') {
          const { access_token, refresh_token } = response.data;

          authStore.setUserAuthenticated(
            access_token,
            refresh_token,
            response.data,
          );
        } else {
          throw new Error('Invalid credentials');
        }
      });
    } catch (error: any) {
      console.error('Login failed:', error);
      setErr(error);
    }
  };
  return (
    <div className="login-layer">
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <Logo
          css={{
            overflow: 'visible',
            maxWidth: '100%',
            width: 'calc(80vmin - 10px);',
          }}
        />

        <span>Admin Sign in</span>
        <div className="inputs-container">
          <Field
            type="text"
            label="Email"
            controllerProps={{
              name: 'email',
              control: control,
            }}
          />
          <PasswordField
            label="Password"
            controllerProps={{
              name: 'password',
              control: control,
            }}
          />
          {/* <SelectField
            label="Select"
            controllerProps={{ name: 'select', control: control }}
            options={[
              { value: '1', label: '1' },
              { value: '2', label: '2' },
            ]}
          /> */}
          {/* <FileField
            label="File"
            register={{ ...register('files') }}
            controllerProps={{ name: 'files', control: control }}
          /> */}
        </div>
        <div className="options-container">
          {/* <Input
            type={'checkbox'}
            label="Remember me"
            control={control}
            name="rememberMe"
          /> */}
          <TextButton
            text="Forgot password?"
            fontColor={color.secondary}
            fontSize={14}
            fontWeight={600}
            onPress={() => {
              modal(<RecoverModal />, 'Recover Your Password', {
                modalStyle: {
                  width: '50%',
                },
              }).open();
            }}
          />
        </div>
        <TextButton
          fontColor={color.white}
          backgroundColor={color.navy_blue}
          text="Sign in"
          fontSize={16}
          padding={15}
          width="calc(80vmin - 10px);"
          css={{ transition: ' width 0.3s ease' }}
          type="submit"
          blank
        />
        {err && <ErrorAlert defaultMessage={false} message={err.message} />}
      </form>
    </div>
  );
}
