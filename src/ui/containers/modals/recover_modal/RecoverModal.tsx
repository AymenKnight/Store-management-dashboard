import TextButton from '@components/buttons/text_button';
import './style/index.scss';
import color from '@assets/styles/color';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Field from '@components/inputs/field';
import { useState } from 'react';
import { CustomError } from '@libs/CustomError';
import LoadingSpinner from '@components/loading_spinner';
import { recoverPassword } from '@services/api/user_api/user.api';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useOverlayStore } from '@services/zustand/overlayStore';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type Inputs = z.infer<typeof schema>;

interface RecoverModalProps {}
export default function RecoverModal({}: RecoverModalProps) {
  const [err, setErr] = useState<CustomError | undefined>(undefined);
  const { close } = useOverlayStore();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(schema),
  });

  const recoverMutation = useMutation({
    mutationFn: recoverPassword,
    onSuccess: () => {
      reset();
      close();
      toast.success(
        'We have sent a password recovery link to your email address',
        {
          duration: 5000,
        },
      );
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (formData) =>
    recoverMutation.mutate(formData.email);
  return (
    <form className="recover-form " onSubmit={handleSubmit(onSubmit)}>
      <Field
        type="text"
        label="Email"
        inputBorder={true}
        controllerProps={{
          name: 'email',
          control: control,
        }}
      />

      <div className="form-controls">
        {recoverMutation.isLoading ? (
          <LoadingSpinner height={50} width={50} />
        ) : (
          <>
            <TextButton
              text="Cancel"
              fontColor={color.good_black}
              fontWeight={600}
              padding={'8px 15px'}
              onPress={() => {
                reset();
                close();
              }}
            />
            <TextButton
              text="Recover your password"
              backgroundColor={color.primary}
              fontColor={color.white}
              padding={'8px 15px'}
              onPress={() => {
                handleSubmit(onSubmit)();
              }}
            />
          </>
        )}
      </div>
    </form>
  );
}
