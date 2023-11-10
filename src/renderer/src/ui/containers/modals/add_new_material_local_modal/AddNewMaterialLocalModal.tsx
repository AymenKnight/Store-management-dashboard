/* eslint-disable @typescript-eslint/naming-convention */
import TextButton from '@components/buttons/text_button';
import './style/index.scss';
import color from '@assets/styles/color';
import Field from '@components/inputs/field';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { queriesKeys } from '@services/queriesKeys';
import { material } from '@services/dataTypes';
import { useOverlayStore } from '@services/zustand/overlayStore';
import toast from 'react-hot-toast';
import { createMaterialLocalByLessonId } from '@services/api/material_api/material.api';
import FileField from '@components/inputs/file_field';
import { CustomError } from '@libs/CustomError';
import LoadingSpinner from '@components/loading_spinner';

interface MaterialProps {
  title: string;
  file: FileList;
}

const schema = z.object({
  title: z.string().min(3, 'title is required'),
  file: z.custom<FileList>().refine(
    (val) => {
      return val.length > 0;
    },
    {
      message: 'Please select a file',
    },
  ),
});

interface AddNewMaterialLocalModalProps {
  defaultValues?: material;
  courseId: string;
  lessonId: string;
}
export default function AddNewMaterialLocalModal({
  defaultValues,
  courseId,
  lessonId,
}: AddNewMaterialLocalModalProps) {
  const { close } = useOverlayStore();
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    register,

    reset,
    formState: { errors },
  } = useForm<MaterialProps>({
    defaultValues: {
      title: defaultValues != undefined ? defaultValues.title : '',
      file: undefined,
    },
    resolver: zodResolver(schema),
  });

  const {
    mutate: createNewMaterialLocalMutation,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: createMaterialLocalByLessonId,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queriesKeys.Course, courseId],
      });

      reset();
      close();
      toast.success('New material has been created successfully');
    },
    onError: (err: CustomError) => {
      console.log('err', err);
      toast.error(err.message);
    },
  });

  const onSubmit: SubmitHandler<MaterialProps> = async (formData) => {
    const fd = new FormData();

    fd.append('file', formData.file[0] as File);
    fd.append('lessonId', lessonId);
    fd.append('title', formData.title);
    createNewMaterialLocalMutation(fd);
  };

  return (
    <form className="material-local-form" onSubmit={handleSubmit(onSubmit)}>
      <Field
        type="text"
        label="Title"
        inputBorder={true}
        controllerProps={{
          name: 'title',
          control: control,
        }}
      />

      <FileField
        label="File"
        inputBorder={true}
        register={{ ...register('file') }}
        controllerProps={{ name: 'file', control: control }}
      />

      <div
        className="form-controls"
        css={{
          justifyContent: isLoading ? 'center' : 'flex-end',
        }}
      >
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
              text={defaultValues ? 'Update' : 'Create'}
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
