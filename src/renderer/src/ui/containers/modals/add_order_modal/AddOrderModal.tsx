import './style/index.scss';
import color from '@assets/styles/color';
import Field from '@components/inputs/field';
import TextButton from '@components/buttons/text_button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Course, CreateOrder, Student } from '@services/dataTypes';
import { queriesKeys } from '@services/queriesKeys';
import { fetchUsers } from '@services/api/user_api/user.api';
import { fetchCourses } from '@services/api/course_api/course.api';
import toast from 'react-hot-toast';
import { useOverlayStore } from '@services/zustand/overlayStore';
import { CustomError } from '@libs/CustomError';
import ErrorAlert from '@components/error_alert';
import LoadingSpinner from '@components/loading_spinner';
import CourseBriefItem from '@components/course_brief_item';
import AutocompleteSearch from '@components/autocomplete_search';
import MemberItem from '@components/member_item';
import { createOrder } from '@services/api/payments_api/payments.api';
import Checkbox from '@components/inputs/checkbox';
import FileField from '@components/inputs/file_field';
import SelectField from '@components/inputs/select_field';

const schema = z.object({
  client: z
    .array(z.string())
    .min(1, 'Client is required')
    .max(1, 'Only one client is required'),
  amount: z.coerce.number().positive('Amount is required'),
  mode: z.string().min(1, 'Payment mode is required'),
  courses: z.array(z.string().min(1, 'Courses are required')),
  file: z.custom<FileList>().optional(),
  imageEnabled: z.boolean(),
});

interface AddOrderModalProps {}
export default function AddOrderModal({}: AddOrderModalProps) {
  const { close } = useOverlayStore();
  const queryClient = useQueryClient();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateOrder>({
    defaultValues: {
      client: [],
      amount: 0,
      mode: 'CCP',
      courses: [],
      file: undefined,
      imageEnabled: false,
    },
    resolver: zodResolver(schema),
  });

  const {
    data: users,
    isLoading: isUsersLoading,
    isSuccess: isUsersSuccess,
    isError: isUsersError,
    refetch: userRefetch,
  } = useQuery<Student[]>({
    queryKey: [queriesKeys.Users],
    queryFn: fetchUsers,
  });

  const students =
    isUsersSuccess && users.length > 0
      ? users.filter((user) => {
          return user.role === 'LEARNER';
        })
      : [];

  const {
    data: courses,
    isError,
    isLoading,
    isSuccess,
    error: courseError,
    refetch,
  } = useQuery<Course[]>({
    queryKey: [queriesKeys.Courses],
    queryFn: fetchCourses,
    retry: (_, err) => {
      if ((err as CustomError).name == 'no_courses_found') {
        return false;
      }

      return true;
    },
  });

  const orderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queriesKeys.Orders],
      });
      close();
      toast.success('Order has been created successfully');
    },
    onError: (err: CustomError) => {
      toast.error(err.name, { duration: 5000 });
    },
  });

  const onSubmit: SubmitHandler<CreateOrder> = (formData) => {
    const fd = new FormData();
    const clientId = formData.client[0];
    if (formData.file) fd.append('file', formData.file[0] as File);
    fd.append('amount', formData.amount.toString());
    fd.append('mode', formData.mode);

    fd.append('client_id', clientId);
    formData.courses.map((course) => {
      fd.append('courses', course.toString());
    });

    orderMutation.mutate(fd);
  };

  return (
    <>
      {isLoading || isUsersLoading ? (
        <div
          className="loading-wrapper"
          css={{ display: 'flex', justifyContent: 'center' }}
        >
          <LoadingSpinner height={100} width={100} />
        </div>
      ) : isUsersSuccess ? (
        <>
          <form className="order-form" onSubmit={handleSubmit(onSubmit)}>
            {isUsersSuccess && (
              <AutocompleteSearch
                controllerProps={{ name: 'client', control: control }}
                inputBorder={true}
                label="Select Client"
                options={students.map((student) => ({
                  value: student.id,
                  label: student.name,
                  id: student.id,
                  component: (
                    <MemberItem
                      name={student.name}
                      id={student.id}
                      src={student.avatar_url}
                      key={student.id}
                    />
                  ),
                }))}
              />
            )}
            <Field
              type="number"
              label="Amount"
              inputBorder={true}
              controllerProps={{
                name: 'amount',
                control: control,
              }}
            />

            {isSuccess ||
            (isError &&
              (courseError as CustomError).name == 'no_courses_found') ? (
              <AutocompleteSearch
                controllerProps={{ name: 'courses', control: control }}
                inputBorder={true}
                label="Select Courses"
                options={
                  isSuccess
                    ? courses.map((course) => ({
                        value: course.id,
                        label: course.title,
                        id: course.id,

                        component: (
                          <CourseBriefItem
                            id={course.id}
                            title={course.title}
                            grade={course.grade.value}
                            subject={course.subject.name}
                            semester={course.semester}
                            image_url={course.image_url}
                            price={course.price}
                            teacherName={course.teacher.name}
                            key={course.id}
                          />
                        ),
                      }))
                    : []
                }
              />
            ) : (
              isError &&
              (courseError as CustomError).name != 'no_courses_found' && (
                <ErrorAlert
                  button={true}
                  defaultMessage={true}
                  referch={refetch}
                />
              )
            )}

            <SelectField
              label="Payment mode"
              inputBorder={true}
              controllerProps={{ name: 'mode', control: control }}
              options={[
                { label: 'CCP', value: 'CCP' },
                { label: 'EDAHABIA', value: 'EDAHABIA' },
                { label: 'CIB', value: 'CIB' },
              ]}
            />

            <div className="order-image-option">
              <Checkbox
                label="Enable this if you want to provide the payment image"
                controllerProps={{ name: 'imageEnabled', control: control }}
              />

              {watch('imageEnabled') && (
                <FileField
                  label="Image"
                  inputBorder={true}
                  register={{ ...register('file') }}
                  controllerProps={{ name: 'file', control: control }}
                />
              )}
            </div>
          </form>

          <div className="form-controls">
            {orderMutation.isLoading ? (
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
                  text={'Create'}
                  backgroundColor={color.primary}
                  fontColor={color.white}
                  padding={'8px 15px'}
                  onPress={() => {
                    handleSubmit(onSubmit)();
                  }}
                  type="submit"
                />
              </>
            )}
          </div>
        </>
      ) : (
        (isError || isUsersError) && (
          <ErrorAlert
            button={true}
            defaultMessage={true}
            referch={() => {
              refetch();
              userRefetch();
            }}
          />
        )
      )}
    </>
  );
}
