import TextButton from '@components/buttons/text_button';
import './style/index.scss';
import Field from '@components/inputs/field';
import PasswordField from '@components/inputs/password_field';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateUser } from '@services/api/user_api/user.api';
import { queriesKeys } from '@services/queriesKeys';
import toast from 'react-hot-toast';
import { Teacher, TeacherUpdate } from '@services/dataTypes';
import FileField from '@components/inputs/file_field';
import { useOverlayStore } from '@services/zustand/overlayStore';
import { CustomError } from '@libs/CustomError';
import color from '@assets/styles/color';
import LoadingSpinner from '@components/loading_spinner';

const schema = z.object({
  name: z.string().min(3, 'Name is required').optional(),
  email: z.string().email('Please enter a valid email').optional(),
  phone_number: z.string().min(8, 'Phone number is required').optional(),
  password: z.string().optional(),
  file: z.custom<FileList>().optional(),
});

interface UpdateTeacherModelProps {
  teacher: Teacher;
}
export default function UpdateTeacherModel({
  teacher,
}: UpdateTeacherModelProps) {
  const queryClient = useQueryClient();
  const { close } = useOverlayStore();
  const { control, handleSubmit, register } = useForm<TeacherUpdate>({
    defaultValues: {
      name: teacher.name,
      email: teacher.email,
      phone_number: teacher.phone_number ?? undefined,
      password: '',
      file: undefined,
    },
    resolver: zodResolver(schema),
  });

  const {
    mutate: updateTeacherMutation,
    isLoading,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.Users] });
      toast.success('Teacher has been updated successfully');
      close();
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });

  const onSubmit: SubmitHandler<TeacherUpdate> = (formData) => {
    const fd = new FormData();

    if (formData.file) {
      fd.append('file', formData.file[0] as File);
    }

    if (formData.file) {
      if (formData.file[0] === undefined) {
        delete formData.file;
      }
    }

    if (formData.password) fd.append('password', formData.password);
    if (formData.password === '') {
      delete formData.password;
    }

    if (formData.name) fd.append('name', formData.name);
    if (formData.email) fd.append('email', formData.email);
    if (formData.phone_number) fd.append('phone_number', formData.phone_number);

    updateTeacherMutation({ userId: teacher.id, userData: fd });
  };

  return (
    <form className="teachers-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="main-form-inputs">
        <Field
          type="text"
          label="Name"
          inputBorder={true}
          controllerProps={{
            name: 'name',
            control: control,
          }}
        />

        <Field
          type="text"
          label="Email"
          inputBorder={true}
          controllerProps={{
            name: 'email',
            control: control,
          }}
        />

        <Field
          type="text"
          label="Phone"
          inputBorder={true}
          controllerProps={{
            name: 'phone_number',
            control: control,
          }}
        />

        <FileField
          label="Image"
          inputBorder={true}
          register={{ ...register('file') }}
          controllerProps={{ name: 'file', control: control }}
        />

        <PasswordField
          label="Password"
          inputBorder={true}
          controllerProps={{
            name: 'password',
            control: control,
          }}
        />
      </div>
      <div className="form-controls">
        {isLoading ? (
          <LoadingSpinner height={50} width={50} />
        ) : (
          <>
            <TextButton
              text="Cancel"
              fontColor={color.good_black}
              fontWeight={600}
              padding={'8px 15px'}
              onPress={() => {
                close();
              }}
            />
            <TextButton
              text="Edit"
              onPress={() => {
                handleSubmit(onSubmit)();
              }}
              type="submit"
              backgroundColor={color.primary}
              fontColor={color.white}
              padding={'8px 15px'}
            />
          </>
        )}
      </div>
    </form>
  );
}
