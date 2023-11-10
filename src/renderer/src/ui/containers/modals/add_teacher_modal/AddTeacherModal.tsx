import TextButton from '@components/buttons/text_button';
import CreateModel from '../create_model';
import './style/index.scss';
import color from '@assets/styles/color';
import Field from '@components/inputs/field';
import PasswordField from '@components/inputs/password_field';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createUser } from '@services/api/user_api/user.api';
import { queriesKeys } from '@services/queriesKeys';
import toast from 'react-hot-toast';
import { CreateUser } from '@services/dataTypes';
import FileField from '@components/inputs/file_field';
import LoadingSpinner from '@components/loading_spinner';
import { CustomError } from '@libs/CustomError';

const schema = z.object({
  name: z.string().min(3, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  role: z.string(),
  phone_number: z.string().min(10, 'Phone number is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  file: z.custom<FileList>().optional(),
});

interface AddTeacherModalProps {
  open: boolean;
  handleClose: () => void;
}
export default function AddTeacherModal({
  open,
  handleClose,
}: AddTeacherModalProps) {
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset, register } = useForm<CreateUser>({
    defaultValues: {
      name: '',
      email: '',
      phone_number: '',
      password: '',
      role: 'TEACHER',
      file: undefined,
    },
    resolver: zodResolver(schema),
  });

  const createTeacherMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.Users] });
      toast.success('Teacher has been created successfully');
      reset();
      handleClose();
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });

  const onSubmit: SubmitHandler<CreateUser> = (formData) => {
    const fd = new FormData();
    if (formData.file) {
      fd.append('file', formData.file[0] as File);
    }

    if (formData.file) {
      if (formData.file[0] === undefined) {
        delete formData.file;
      }
    }

    fd.append('name', formData.name);
    fd.append('email', formData.email);
    fd.append('role', formData.role);
    fd.append('phone_number', formData.phone_number);
    fd.append('password', formData.password);

    createTeacherMutation.mutate(fd);
  };

  return (
    <CreateModel
      open={open}
      handleClose={handleClose}
      title="Add Teacher"
      className="add-teacher-modal"
      controls={
        <>
          {createTeacherMutation.isLoading ? (
            <LoadingSpinner height={50} width={50} />
          ) : (
            <>
              <TextButton
                text="Cancel"
                fontColor={color.good_black}
                fontWeight={600}
                padding={'8px 15px'}
                onPress={handleClose}
              />
              <TextButton
                text="Create"
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
        </>
      }
    >
      <form className="teachers-form" onSubmit={handleSubmit(onSubmit)}>
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
      </form>
    </CreateModel>
  );
}
