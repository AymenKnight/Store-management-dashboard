import TextButton from '@components/buttons/text_button';
import CreateModel from '../create_model';
import './style/index.scss';
import color from '@assets/styles/color';
import Field from '@components/inputs/field';
import SelectField from '@components/inputs/select_field';
import FileField from '@components/inputs/file_field';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Grades, Subject, SubjectRes } from '@services/dataTypes';
import { z } from 'zod';
import { addSubject, fetchGrades } from '@services/api/grades_api/grades.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '@components/loading_spinner';
import { queriesKeys } from '@services/queriesKeys';
import toast from 'react-hot-toast';
import { CustomError } from '@libs/CustomError';
import ErrorAlert from '@components/error_alert';

export interface AddSubjectProps {
  gradeId: string;
  file: FileList;
  name: string;
}

const schema = z.object({
  name: z.string().min(3, 'Name is required'),
  gradeId: z.string().min(1, 'Grade is required'),
  file: z.custom<FileList>().refine(
    (val) => {
      // console.log('val', val.length);
      return val.length > 0;
    },
    {
      message: 'Please select an image',
    },
  ),
});
interface AddBranchModalProps {
  handleClose: () => void;
  open: boolean;
}
export default function AddBranchModal({
  open,
  handleClose,
}: AddBranchModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddSubjectProps>({
    defaultValues: {
      gradeId: '',
      file: undefined,
      name: '',
    },
    resolver: zodResolver(schema),
  });
  const addSubjectMutation = useMutation({
    mutationFn: addSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.Branches] });
      handleClose();
      reset();
      toast.success('Subject has been created successfully');
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });
  const onSubmit: SubmitHandler<AddSubjectProps> = (formData) => {
    console.log(formData);
    const fd = new FormData();
    if (formData.file) fd.append('file', formData.file[0] as File);
    fd.append('name', formData.name);
    fd.append('gradeId', formData.gradeId);

    addSubjectMutation.mutate(fd);
  };

  const {
    data: grades,
    isSuccess: isGradesSuccess,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Grades[]>({
    queryKey: [queriesKeys.Grades],
    queryFn: fetchGrades,
  });

  return (
    <CreateModel
      title={'Add Subject'}
      open={open}
      handleClose={handleClose}
      width={'50%'}
      className="add-branch-modal"
      controls={
        <>
          {addSubjectMutation.isLoading ? (
            <LoadingSpinner height={50} width={50} />
          ) : (
            <>
              <TextButton
                text="Cancel"
                // backgroundColor={color.hot_red}
                fontColor={color.good_black}
                fontWeight={600}
                padding={'8px 15px'}
                onPress={handleClose}
              />
              <TextButton
                text="Create"
                backgroundColor={color.primary}
                fontColor={color.white}
                padding={'8px 15px'}
                onPress={() => {
                  handleSubmit(onSubmit)();
                  console.log('clicked');
                }}
              />
            </>
          )}
        </>
      }
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : isGradesSuccess ? (
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

          <SelectField
            label="Grade"
            inputBorder={true}
            controllerProps={{ name: 'gradeId', control: control }}
            options={grades.map((grade) => {
              return { value: `${grade.id}`, label: `${grade.value}` };
            })}
          />

          <FileField
            label="Image"
            inputBorder={true}
            register={{ ...register('file') }}
            controllerProps={{ name: 'file', control: control }}
          />
        </form>
      ) : (
        isError &&
        isError && (
          <ErrorAlert button={true} defaultMessage={true} referch={refetch} />
        )
      )}
    </CreateModel>
  );
}
