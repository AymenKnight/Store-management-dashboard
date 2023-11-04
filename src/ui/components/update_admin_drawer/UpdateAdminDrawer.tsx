import { AdminUpdate } from '@services/dataTypes';
import './style/index.scss';
import Drawer from '@mui/material/Drawer';
import TextButton from '@components/buttons/text_button';
import color from '@assets/styles/color';
import Field from '@components/inputs/field';
import FileField from '@components/inputs/file_field';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { useAuthStore } from '@services/zustand/authStore';
import toast from 'react-hot-toast';
import { updateAdmin } from '@services/api/user_api/user.api';
import { useMutation } from '@tanstack/react-query';
import CircleAvatar from '@components/circle_avatar';
import Header from '@components/header';
import PasswordField from '@components/inputs/password_field';
import LoadingSpinner from '@components/loading_spinner';
import { CustomError } from '@libs/CustomError';

interface UpdateAdminDrawerProps {
  openDrawer: boolean;
  handleCloseDrawer: () => void;
}

const schema = z.object({
  name: z.string().min(3, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().optional(),
  file: z.custom<FileList>().optional(),
});

export default function UpdateAdminDrawer({
  openDrawer,
  handleCloseDrawer,
}: UpdateAdminDrawerProps) {
  const user = useAuthStore((state) => state.user);
  const updateUserInfo = useAuthStore((state) => state.updateUserInfo);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AdminUpdate>({
    defaultValues: {
      name: user?.name,
      email: user?.email,
      password: '',
      file: undefined,
    },
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    setValue('name', `${user?.name}`);
    setValue('email', `${user?.email}`);
  }, [user, setValue]);

  const updateAdminMutation = useMutation({
    mutationFn: updateAdmin,
    onSuccess: (data) => {
      updateUserInfo({
        email: data.email,
        name: data.name,
        avatarUrl: data.avatar_url,
      });
      reset();
      handleCloseDrawer();
      toast.success('Your Informations has been updated successfully');
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });

  const onSubmit: SubmitHandler<AdminUpdate> = (formData: AdminUpdate) => {
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

    fd.append('name', formData.name);
    fd.append('email', formData.email);

    console.log(fd);
    console.log(formData);

    updateAdminMutation.mutate(fd);
  };

  return (
    <Drawer
      anchor={'right'}
      open={openDrawer}
      onClose={() => {
        handleCloseDrawer();
        reset();
      }}
      className="update-admin-drawer"
    >
      <div className="drawer-head">
        <h3>Edit your informations:</h3>
      </div>
      <div className="drawer-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="admin-avatar" css={{ position: 'relative' }}>
            <FileField
              css={{ opacity: 0 }}
              label="Image"
              inputBorder={true}
              register={{ ...register('file') }}
              controllerProps={{ name: 'file', control: control }}
            />
            <CircleAvatar
              css={{
                position: 'absolute',
                top: '25px',
                left: '149px',
                zIndex: '-1',
              }}
              width={70}
              alt={`${user?.name}`}
              src={`${user?.avatar_url}?${new Date()}`}
            />
            <Header
              justifyContent="center"
              title={{
                text: `${user?.name}`,
                fontColor: 'black',
                fontSize: 18,
                fontWeight: 'bold',
              }}
            />
          </div>
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

          <PasswordField
            label="Password"
            inputBorder={true}
            controllerProps={{
              name: 'password',
              control: control,
            }}
          />
        </form>
      </div>
      <div className="drawer-footer">
        <div>
          {updateAdminMutation.isLoading ? (
            <LoadingSpinner height={50} width={50} />
          ) : (
            <>
              <TextButton
                text="Cancel"
                width={100}
                fontColor={color.good_black}
                fontWeight={600}
                padding={'8px 15px'}
                onPress={() => {
                  handleCloseDrawer();
                  reset();
                }}
              />
              <TextButton
                text="Edit"
                backgroundColor={color.primary}
                fontColor={color.white}
                width={100}
                padding={'8px 15px'}
                onPress={() => {
                  handleSubmit(onSubmit)();
                }}
              />
            </>
          )}
        </div>
      </div>
    </Drawer>
  );
}
