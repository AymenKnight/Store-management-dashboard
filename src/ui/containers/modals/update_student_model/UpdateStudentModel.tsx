import TextButton from '@components/buttons/text_button';
import './style/index.scss';
import color from '@assets/styles/color';
import Field from '@components/inputs/field';
import PasswordField from '@components/inputs/password_field';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateUser } from '@services/api/user_api/user.api';
import { queriesKeys } from '@services/queriesKeys';
import toast from 'react-hot-toast';
import {
  Grades,
  Student,
  StudentUpdate,
  SubjectRes,
} from '@services/dataTypes';
import FileField from '@components/inputs/file_field';
import SelectField from '@components/inputs/select_field';
import {
  fetchGrades,
  filterSubject,
} from '@services/api/grades_api/grades.api';
import LoadingSpinner from '@components/loading_spinner';
import { useOverlayStore } from '@services/zustand/overlayStore';
import { CustomError } from '@libs/CustomError';

const schema = z.object({
  name: z.string().min(3, 'Name is required').optional(),
  email: z.string().email('Please enter a valid email').optional(),
  phone_number: z.string().min(8, 'Phone number is required').optional(),
  gradeId: z.string().min(1, 'Grade is required').optional(),
  subjectId: z.string().min(1, 'Branch is required').optional(),
  password: z.string().optional(),
  file: z.custom<FileList>().optional(),
});

interface UpdateStudentModelProps {
  student: Student;
}
export default function UpdateStudentModel({
  student,
}: UpdateStudentModelProps) {
  const { close } = useOverlayStore();
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset, watch, register } =
    useForm<StudentUpdate>({
      defaultValues: {
        name: student.name,
        email: student.email,
        phone_number: student.phone_number ?? undefined,
        gradeId: student.grade.id,
        subjectId: student.subject.id,
        password: '',
        file: undefined,
      },
      resolver: zodResolver(schema),
    });

  const {
    data: grades,
    isSuccess: isGradesSuccess,
    isLoading,
    isError,
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

  const { mutate: updateStudentMutation, isLoading: isLoadingUpdate } =
    useMutation({
      mutationFn: updateUser,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queriesKeys.Users] });
        close();
        toast.success('Student has been updated successfully');
      },
      onError: (err: CustomError) => {
        toast.error(err.message, {
          duration: 5000,
        });
      },
    });

  const onSubmit: SubmitHandler<StudentUpdate> = (formData) => {
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
    if (formData.gradeId) fd.append('gradeId', formData.gradeId);
    if (formData.subjectId) fd.append('subjectId', formData.subjectId);

    updateStudentMutation({ userId: student.id, userData: fd });
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : isGradesSuccess ? (
        <form className="students-form" onSubmit={handleSubmit(onSubmit)}>
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
          </div>

          <div className="form-controls">
            {isLoadingUpdate ? (
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
      ) : (
        isError && <div>error</div>
      )}
    </>
  );
}
