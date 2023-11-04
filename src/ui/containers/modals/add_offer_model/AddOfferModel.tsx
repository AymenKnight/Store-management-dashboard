import TextButton from '@components/buttons/text_button';
import './style/index.scss';
import Field from '@components/inputs/field';
import SelectField from '@components/inputs/select_field';
import color from '@assets/styles/color';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createOffre } from '@services/api/offres_api/offres.api';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Course } from '@services/dataTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { queriesKeys } from '@services/queriesKeys';
import toast from 'react-hot-toast';
import AutocompleteSearch from '@components/autocomplete_search';
import { fetchCourses } from '@services/api/course_api/course.api';
import { useOverlayStore } from '@services/zustand/overlayStore';
import { isAfter, parseISO, startOfDay, isToday } from 'date-fns';
import CourseBriefItem from '@components/course_brief_item';
import { CustomError } from '@libs/CustomError';
import LoadingSpinner from '@components/loading_spinner';
import ErrorAlert from '@components/error_alert';

interface AddOfferModelProps {}

interface AddOfferProp {
  title: string;
  description: string;
  type: string;
  discountAmount: number;
  expirationDate: string;
  offer: {
    type: string;
    courses: string[];
  };
}
export default function AddOfferModel({}: AddOfferModelProps) {
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
    return true; // No courses required for 'All Courses' type
  };

  const schema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    discountAmount: z.coerce.number().positive('Discount amount is required'),
    expirationDate: z
      .string()
      .min(1, 'Expiration date is required')
      .refine(
        (dateString) => {
          const expirationDate = parseISO(dateString);
          const today = startOfDay(new Date());
          console.log(expirationDate, today);
          return isAfter(expirationDate, today) || isToday(expirationDate);
        },
        {
          message: 'Expiration date must be valid',
        },
      ),
    offer: z
      .object({
        type: z.string().min(1, 'Type is required'),
        courses: z.array(z.string().min(1, 'Courses are required')),
      })
      .superRefine((val, ctx) => {
        validateCourses(val.courses, val.type, ctx);
      }),
  });

  const { control, handleSubmit, watch, reset } = useForm<AddOfferProp>({
    defaultValues: {
      title: '',
      description: '',
      discountAmount: 0,
      expirationDate: '',
      offer: {
        type: '',
        courses: [],
      },
    },
    resolver: zodResolver(schema),
  });

  const type = watch('offer.type');
  const {
    data: courses,
    isError,
    error: courseError,
    isSuccess,
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

  const offresMutation = useMutation({
    mutationFn: createOffre,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queriesKeys.Offres] });
      reset();
      close();
      toast.success('Offer has been created successfully');
    },
    onError: (err: CustomError) => {
      toast.error(err.message, {
        duration: 5000,
      });
    },
  });

  const onSubmit: SubmitHandler<AddOfferProp> = (formData) => {
    offresMutation.mutate({
      courses:
        formData.offer.type === 'ALL_COURSES'
          ? undefined
          : formData.offer.courses,
      description: formData.description,
      discountAmount: formData.discountAmount,
      expirationDate: formData.expirationDate,
      title: formData.title,
      type: formData.offer.type,
    });
  };
  return (
    <form className="offers-form" onSubmit={handleSubmit(onSubmit)}>
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
          type="date"
          label="Expiration Date"
          inputBorder={true}
          controllerProps={{
            name: 'expirationDate',
            control: control,
          }}
        />

        <SelectField
          label="Select Offer Type"
          inputBorder={true}
          controllerProps={{ name: 'offer.type', control: control }}
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
          controllerProps={{ name: 'offer.courses', control: control }}
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
        {offresMutation.isLoading ? (
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
