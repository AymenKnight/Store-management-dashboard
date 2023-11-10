import TextButton from '@components/buttons/text_button';
import CreateModel from '../create_model';
import './style/index.scss';
import color from '@assets/styles/color';
import Field from '@components/inputs/field';
import PasswordField from '@components/inputs/password_field';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createUser } from '@services/api/user_api/user.api';
import { queriesKeys } from '@services/queriesKeys';
import toast from 'react-hot-toast';
import { CreateUser, Grades, SubjectRes } from '@services/dataTypes';
import FileField from '@components/inputs/file_field';
import SelectField from '@components/inputs/select_field';
import {
  fetchGrades,
  filterSubject,
} from '@services/api/grades_api/grades.api';
import LoadingSpinner from '@components/loading_spinner';
import ErrorAlert from '@components/error_alert';
import { CustomError } from '@libs/CustomError';

const schema = z.object({
  name: z.string().min(3, 'Name is required'),
  email: z.string().email('Please enter a valid email'),
  role: z.string(),
  phone_number: z.string().min(10, 'Phone number is required'),
  gradeId: z.string().min(1, 'Grade is required'),
  subjectId: z.string().min(1, 'Branch is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  file: z.custom<FileList>().optional(),
});

interface AddStudentModalProps {
  open: boolean;
  handleClose: () => void;
}
export default function AddStudentModal({
  open,
  handleClose,
}: AddStudentModalProps) {
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset, watch, register } = useForm<CreateUser>(
    {
      defaultValues: {
        name: '',
        email: '',
        phone_number: '',
        gradeId: '',
        subjectId: '',
        password: '',
        role: 'LEARNER',
        file: undefined,
      },
      resolver: zodResolver(schema),
    },
  );

  const {
    data: grades,
    isSuccess: isGradesSuccess,
    isLoading,
    isError,
    refetch,
  } = useQuery<Grades[]>({
    queryKey: [queriesKeys.Grades],
    queryFn: fetchGrades,
  });

  const {
    data: subjects,
    isLoading: isSubjectsLoading,
    isSuccess: isSubjectsSuccess,
    // isError: isSubjectsError,
  } = useQuery<SubjectRes[]>({
    queryKey: [queriesKeys.Branches, watch('gradeId')],
    queryFn: () => filterSubject(watch('gradeId')),
    enabled: isGradesSuccess && watch('gradeId') != '',
  });

  const createStudentMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.Users] });
      toast.success('Student has been created successfully');
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
    if (formData.gradeId) fd.append('gradeId', formData.gradeId);
    if (formData.subjectId) fd.append('subjectId', formData.subjectId);
    fd.append('password', formData.password);

    createStudentMutation.mutate(fd);
  };

  return (
    <CreateModel
      open={open}
      handleClose={handleClose}
      title="Add Student"
      className="add-student-modal"
      controls={
        <>
          {createStudentMutation.isLoading ? (
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
      {isLoading ? (
        <LoadingSpinner />
      ) : isGradesSuccess ? (
        <form className="students-form" onSubmit={handleSubmit(onSubmit)}>
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

          <SelectField
            label="Grade"
            inputBorder={true}
            controllerProps={{ name: 'gradeId', control: control }}
            options={grades.map((grade) => {
              return { value: `${grade.id}`, label: `${grade.value}` };
            })}
          />

          {isSubjectsSuccess && !isSubjectsLoading ? (
            <SelectField
              label="Branch"
              inputBorder={true}
              controllerProps={{
                name: 'subjectId',
                control: control,
              }}
              options={subjects?.map((subject) => {
                return { value: `${subject.id}`, label: `${subject.name}` };
              })}
            />
          ) : (
            <SelectField
              label="Branch"
              inputBorder={true}
              controllerProps={{
                name: 'subjectId',
                control: control,
              }}
              options={[]}
            />
          )}

          <PasswordField
            label="Password"
            inputBorder={true}
            controllerProps={{
              name: 'password',
              control: control,
            }}
          />
        </form>
      ) : (
        isError && (
          <ErrorAlert button={true} defaultMessage={true} referch={refetch} />
        )
      )}
    </CreateModel>
  );
}
