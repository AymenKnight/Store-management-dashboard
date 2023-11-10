import Header from '@components/header';
import './style/index.scss';
import color from '@assets/styles/color';
import SelectField from '@components/inputs/select_field';
import Field from '@components/inputs/field';
import FileField from '@components/inputs/file_field';
import TextButton from '@components/buttons/text_button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import TextAreaField from '@components/inputs/text_area/TextArea';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Grades, SemesterType, SubjectRes, Teacher } from '@services/dataTypes';
import { queriesKeys } from '@services/queriesKeys';
import {
  fetchGrades,
  filterSubject,
} from '@services/api/grades_api/grades.api';
import LoadingSpinner from '@components/loading_spinner';
import { fetchUsers } from '@services/api/user_api/user.api';
import { createCourse } from '@services/api/course_api/course.api';
import { router } from '@services/routes';
import toast from 'react-hot-toast';
import ErrorAlert from '@components/error_alert';
import { CustomError } from '@libs/CustomError';
import Checkbox from '@components/inputs/checkbox';

export interface AddCourseProps {
  title: string;
  price: number;
  description?: string;
  gradeId: string;
  subjectId: string;
  semester: SemesterType[];
  teacherId: string;
  topRated: boolean;
  popular: boolean;
  file: FileList;
}

const schema = z.object({
  title: z.string().min(3, 'title is required'),
  price: z.string().min(1, 'price is required'),
  description: z.string().min(3, 'description is required').optional(),
  gradeId: z.string().min(1, 'Grade is required'),
  subjectId: z.string().min(1, 'Subject is required'),
  semester: z.array(z.string()).min(1, 'Semester is required'),
  teacherId: z.string().min(1, 'Teacher is required'),
  topRated: z.boolean().optional(),
  popular: z.boolean().optional(),
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

interface CreateCourseProps {}
export default function CreateCourse({}: CreateCourseProps) {
  const queryClient = useQueryClient();
  const {
    register,
    control,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<AddCourseProps>({
    defaultValues: {
      title: '',
      price: 0,
      description: '',
      subjectId: '',
      semester: [],
      teacherId: '',
      topRated: false,
      popular: false,
      gradeId: '',
      file: undefined,
    },
    resolver: zodResolver(schema),
  });

  const {
    data: users,
    isLoading: isUsersLoading,
    isSuccess: isUsersSuccess,
    isError: isUsersError,
    refetch: usersRefetch,
  } = useQuery<Teacher[]>({
    queryKey: [queriesKeys.Users],
    queryFn: fetchUsers,
  });

  const teachers =
    isUsersSuccess && users.length > 0
      ? users.filter((user) => {
          return user.role === 'TEACHER';
        })
      : [];

  const {
    data: grades,
    isSuccess: isGradesSuccess,
    isError: isGradeError,
    error: gradeError,
    refetch: gradeRefetch,
  } = useQuery<Grades[]>({
    queryKey: [queriesKeys.Grades],
    queryFn: fetchGrades,
    enabled: !!isUsersSuccess,
  });
  const {
    data: subjects,
    isSuccess: isSubjectsSuccess,
    isLoading,
    isError: isSubjectError,
    error: subjectError,
    refetch: subjectRefetch,
  } = useQuery<SubjectRes[]>({
    queryKey: [queriesKeys.Branches, watch('gradeId')],
    queryFn: () => {
      return filterSubject(watch('gradeId'));
    },
    enabled: isGradesSuccess && watch('gradeId') != '',
  });

  const addNewCourse = useMutation({
    mutationKey: [queriesKeys.Courses],
    mutationFn: createCourse,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.Courses] });
      router.navigate({
        to: '/COURSES/$courseId',
        params: { courseId: data.id },
        from: '/COURSES/createCourse',
      });
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });

  const onSubmit: SubmitHandler<AddCourseProps> = async (formData) => {
    console.log('formData', formData);
    const fd = new FormData();
    if (formData.file) fd.append('file', formData.file[0] as File);
    fd.append('title', formData.title);
    if (!isNaN(Number(formData.price)))
      fd.append('price', formData.price.toString());
    if (formData.description) fd.append('description', formData.description);
    fd.append('teacherId', formData.teacherId);
    fd.append('subjectId', formData.subjectId);
    if (formData.popular) fd.append('popular', 'true');
    if (formData.topRated) fd.append('topRated', 'true');
    formData.semester.map((semester) => {
      fd.append('semester', semester.toString());
    });

    fd.append('gradeId', formData.gradeId);

    await addNewCourse.mutate(fd);
  };

  return (
    <div className="create-course">
      <div className="create-course-content">
        <Header
          title={{
            text: 'Create Course',
            fontColor: color.white,
            fontSize: 22,
            fontWeight: 600,
          }}
          padding={'10px 20px'}
          backgroundColor={color.primary}
        />

        {(isLoading && watch('gradeId').length > 1) || isUsersLoading ? (
          <div className="loading-wrapper">
            <LoadingSpinner height={100} width={100} />
          </div>
        ) : isGradesSuccess && isUsersSuccess ? (
          <>
            <form className="course-form" onSubmit={handleSubmit(onSubmit)}>
              <Field
                type="text"
                label="Title"
                inputBorder={true}
                controllerProps={{
                  name: 'title',
                  control: control,
                }}
              />
              <Field
                type="number"
                label="Price"
                inputBorder={true}
                controllerProps={{
                  name: 'price',
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
              <SelectField
                label="Subject"
                inputBorder={true}
                controllerProps={{ name: 'subjectId', control: control }}
                options={
                  grades.length > 0 && isSubjectsSuccess
                    ? subjects.map((subject) => {
                        return {
                          value: subject.id,
                          label: subject.name,
                        };
                      })
                    : []
                }
              />
              <TextAreaField
                type="text"
                label="Description"
                inputBorder={true}
                controllerProps={{
                  name: 'description',
                  control: control,
                }}
              />
              <SelectField
                label="Semester"
                inputBorder={true}
                multiple={true}
                controllerProps={{ name: 'semester', control: control }}
                options={[
                  { value: 'SEMESTER_1', label: 'SEMESTER_1' },
                  { value: 'SEMESTER_2', label: 'SEMESTER_2' },
                  { value: 'SEMESTER_3', label: 'SEMESTER_3' },
                ]}
              />
              <SelectField
                label="Teacher"
                inputBorder={true}
                controllerProps={{ name: 'teacherId', control: control }}
                options={teachers.map((teacher) => {
                  return { value: `${teacher.id}`, label: `${teacher.name}` };
                })}
              />

              <FileField
                label="Image"
                inputBorder={true}
                inputProps={{ accept: 'image/*' }}
                register={{ ...register('file') }}
                controllerProps={{ name: 'file', control: control }}
              />
              <div className="checkbox-container">
                <Checkbox
                  label="Top rated"
                  controllerProps={{ name: 'topRated', control: control }}
                />
                <Checkbox
                  label="Popular"
                  controllerProps={{ name: 'popular', control: control }}
                />
              </div>
            </form>

            <div
              className="create-course-footer"
              css={{
                justifyContent: addNewCourse.isLoading ? 'center' : 'flex-end',
                alignItems: addNewCourse.isLoading ? 'center' : 'stretch',
              }}
            >
              {addNewCourse.isLoading ? (
                <LoadingSpinner height={50} width={50} />
              ) : (
                <TextButton
                  text={addNewCourse.isLoading ? 'Creating...' : 'Create'}
                  backgroundColor={color.primary}
                  fontColor={color.white}
                  padding={'8px 15px'}
                  onPress={() => {
                    handleSubmit(onSubmit)();
                    console.log('clicked');
                  }}
                />
              )}
            </div>
          </>
        ) : (
          (isGradeError || isSubjectError || isUsersError) && (
            <ErrorAlert
              button={true}
              defaultMessage={true}
              referch={() => {
                gradeRefetch();
                usersRefetch();
                subjectRefetch();
              }}
            />
          )
        )}
      </div>
    </div>
  );
}
