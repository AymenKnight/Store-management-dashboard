import { Course } from '@services/dataTypes';
import CreateModel from '../create_model';
import './style/index.scss';
import TextPair from '@components/text_pair/TextPair';
import color from '@assets/styles/color';

interface ViewCoursesModelProps {
  open: boolean;
  courses: Course[];
  handleClose: () => void;
}
export default function ViewCoursesModel({
  open,
  courses,
  handleClose,
}: ViewCoursesModelProps) {
  return (
    <CreateModel
      title={'Courses'}
      open={open}
      handleClose={handleClose}
      className="view-courses-modal"
    >
      <div className="course-overview-content">
        {courses?.map((course, index) => (
          <div className="course-row" key={index}>
            <img
              src={`${course?.image_url}?${new Date()}`}
              alt={course?.title}
            />
            <TextPair
              first={{
                text: 'Title',
                fontColor: color.good_black,
                fontWeight: 600,
                fontSize: 14,
              }}
              second={{
                text: course?.title,
                fontColor: color.textGray,
                fontWeight: 600,
                fontSize: 15,
              }}
              gap={5}
              alignItems="center"
            />

            <TextPair
              first={{
                text: 'Teacher',
                fontColor: color.good_black,
                fontWeight: 600,
                fontSize: 14,
              }}
              second={{
                text: course.teacher.name,
                fontColor: color.textGray,
                fontWeight: 600,
                fontSize: 15,
              }}
              gap={5}
              alignItems="center"
            />
            <TextPair
              first={{
                text: 'Grade',
                fontColor: color.good_black,
                fontWeight: 600,
                fontSize: 14,
              }}
              second={{
                text: course?.grade.value,
                fontColor: color.textGray,
                fontWeight: 600,
                fontSize: 15,
              }}
              gap={5}
              alignItems="center"
            />
            <TextPair
              first={{
                text: 'Subject',
                fontColor: color.good_black,
                fontWeight: 600,
                fontSize: 14,
              }}
              second={{
                text: course?.subject.name,
                fontColor: color.textGray,
                fontWeight: 600,
                fontSize: 15,
              }}
              gap={5}
              alignItems="center"
            />
            <TextPair
              first={{
                text: 'Price',
                fontColor: color.good_black,
                fontWeight: 600,
                fontSize: 14,
              }}
              second={{
                text: course?.price,
                fontColor: color.textGray,
                fontWeight: 600,
                fontSize: 15,
              }}
              gap={5}
              alignItems="center"
            />
          </div>
        ))}
      </div>
    </CreateModel>
  );
}
