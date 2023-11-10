import TextButton from '@components/buttons/text_button';
import './style/index.scss';
import Field from '@components/inputs/field';
import SelectField from '@components/inputs/select_field';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { queriesKeys } from '@services/queriesKeys';
import { Coupons, Course } from '@services/dataTypes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCoupon } from '@services/api/coupon_api/coupon.api';
import color from '@assets/styles/color';
import { isAfter, isToday, parseISO, startOfDay } from 'date-fns';
import { useOverlayStore } from '@services/zustand/overlayStore';
import { fetchCourses } from '@services/api/course_api/course.api';
import AutocompleteSearch from '@components/autocomplete_search';
import CourseBriefItem from '@components/course_brief_item';
import { CustomError } from '@libs/CustomError';
import ErrorAlert from '@components/error_alert';
import LoadingSpinner from '@components/loading_spinner';

interface AddCouponProp {
  title: string;
  description: string;
  discountAmount: number;
  expirationDate: string;
  maxUses: number;
  coupon: {
    type: string;
    courses: string[];
  };
}

interface AddCouponModelProps {}
export default function AddCouponModel({}: AddCouponModelProps) {
  const { close } = useOverlayStore();
  const queryClient = useQueryClient();

  const validateCourses = (
    courses: string[],
    type: string,
    ctx: z.RefinementCtx,
  ) => {
    if (type === 'PACK_OF_COURSES' && courses.length < 2) {
      ctx.addIssue({
        path: ['courses'],
        message: 'Courses are required',
        code: z.ZodIssueCode.custom,
      });
    }
    if (type === 'SINGLE_COURSE' && courses.length !== 1) {
      ctx.addIssue({
        path: ['courses'],
        message: 'Only one course is required',
        code: z.ZodIssueCode.custom,
      });
    }
    return true;
  };

  const schema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    discountAmount: z.coerce.number().positive('Discount amount is required'),
    maxUses: z.coerce.number().positive('Max uses is required'),
    expirationDate: z
      .string()
      .min(1, 'Expiration date is required')
      .refine(
        (dateString) => {
          const expirationDate = parseISO(dateString);
          const today = startOfDay(new Date());
          return isAfter(expirationDate, today) || isToday(expirationDate);
        },
        {
          message: 'Expiration date must be valid',
        },
      ),
    coupon: z
      .object({
        type: z.string().min(1, 'Type is required'),
        courses: z.array(z.string().min(1, 'Courses are required')),
      })
      .superRefine((val, ctx) => {
        validateCourses(val.courses, val.type, ctx);
      }),
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddCouponProp>({
    defaultValues: {
      title: '',
      description: '',
      discountAmount: 0,
      expirationDate: '',
      maxUses: 0,
      coupon: {
        type: '',
        courses: [],
      },
    },
    resolver: zodResolver(schema),
  });

  const type = watch('coupon.type');
  const {
    data: courses,
    isError,
    isFetching,
    isLoading,
    isSuccess,
    error: courseError,
    refetch,
  } = useQuery<Course[]>({
    queryKey: [queriesKeys.Courses],
    queryFn: fetchCourses,
    enabled: type === 'SINGLE_COURSE' || type === 'PACK_OF_COURSES',
    retry: (_, err) => {
      if ((err as CustomError).name == 'no_courses_found') {
        return false;
      }

      return true;
    },
  });

  const couponsMutation = useMutation({
    mutationFn: createCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.Coupons] });
      reset();
      close();
      toast.success('Coupon has been created successfully');
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });

  const onSubmit: SubmitHandler<AddCouponProp> = (formData) => {
    console.log('formData', formData);
    couponsMutation.mutate({
      courses:
        formData.coupon.type === 'ALL_COURSES'
          ? undefined
          : formData.coupon.courses,
      description: formData.description,
      discountAmount: formData.discountAmount,
      expirationDate: formData.expirationDate,
      title: formData.title,
      type: formData.coupon.type,
      max_uses: formData.maxUses,
    });
  };
  return (
    <form className="coupons-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="main-form-inputs">
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
          type="text"
          label="Description"
          inputBorder={true}
          controllerProps={{
            name: 'description',
            control: control,
          }}
        />

        <Field
          type="number"
          label="Discount Amount"
          inputBorder={true}
          controllerProps={{
            name: 'discountAmount',
            control: control,
          }}
        />

        <Field
          type="number"
          label="Max of uses"
          inputBorder={true}
          controllerProps={{
            name: 'maxUses',
            control: control,
          }}
        />

        <Field
          type="date"
          label="Expiration Date"
          inputBorder={true}
          controllerProps={{
            name: 'expirationDate',
            control: control,
          }}
        />

        <SelectField
          label="Select Coupon Type"
          inputBorder={true}
          controllerProps={{ name: 'coupon.type', control: control }}
          options={[
            { value: 'SINGLE_COURSE', label: 'Single Course' },
            { value: 'PACK_OF_COURSES', label: 'Pack Of Courses' },
            { value: 'ALL_COURSES', label: 'All Courses' },
          ]}
        />
      </div>
      {(isSuccess ||
        (isError && (courseError as CustomError).name == 'no_courses_found')) &&
      type !== '' &&
      type !== 'ALL_COURSES' ? (
        <AutocompleteSearch
          controllerProps={{ name: 'coupon.courses', control: control }}
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
          <ErrorAlert button={true} defaultMessage={true} referch={refetch} />
        )
      )}
      <div className="form-controls">
        {couponsMutation.isLoading ? (
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
      </div>
    </form>
  );
}
