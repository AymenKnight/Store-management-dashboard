import TextButton from '@components/buttons/text_button';
import './style/index.scss';
import color from '@assets/styles/color';
import Field from '@components/inputs/field';
import FileField from '@components/inputs/file_field';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubjectRes } from '@services/dataTypes';
import { z } from 'zod';
import { updateSubject } from '@services/api/grades_api/grades.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queriesKeys } from '@services/queriesKeys';
import toast from 'react-hot-toast';
import { CustomError } from '@libs/CustomError';
import { useOverlayStore } from '@services/zustand/overlayStore';
import LoadingSpinner from '@components/loading_spinner';

export interface UpdateSubjectProps {
  subjectId: string;
  file?: FileList;
  name?: string;
}

const schema = z.object({
  name: z.string().optional(),
  file: z.custom<FileList>().optional(),
});
interface UpdateBranchModalProps {
  subject: SubjectRes;
}
export default function UpdateBranchModal({ subject }: UpdateBranchModalProps) {
  const { close } = useOverlayStore();
  const queryClient = useQueryClient();

  const {
    register,
    control,
    handleSubmit,

    reset,
  } = useForm<UpdateSubjectProps>({
    defaultValues: {
      subjectId: subject.id,
      file: undefined,
      name: subject.name,
    },
    resolver: zodResolver(schema),
  });
  const updateSubjectMutation = useMutation({
    mutationFn: updateSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.Branches] });
      reset();
      close();
      toast.success('Subject has been updated successfully');
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });
  const onSubmit: SubmitHandler<UpdateSubjectProps> = (formData) => {
    const fd = new FormData();
    if (formData.file) fd.append('file', formData.file[0] as File);
    if (formData.name) fd.append('name', formData.name);
    fd.append('subjectId', subject.id);
    updateSubjectMutation.mutate(fd);
  };

  return (
    <form className="branches-form" onSubmit={handleSubmit(onSubmit)}>
      <Field
        type="text"
        label="Name"
        inputBorder={true}
        controllerProps={{
          name: 'name',
          control: control,
        }}
      />

      <FileField
        label="Image"
        inputBorder={true}
        register={{ ...register('file') }}
        controllerProps={{ name: 'file', control: control }}
      />

      <div className="form-controls">
        {updateSubjectMutation.isLoading ? (
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
              text="Update"
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
