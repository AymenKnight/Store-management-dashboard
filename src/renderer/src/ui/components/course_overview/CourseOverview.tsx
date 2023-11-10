/* eslint-disable @typescript-eslint/naming-convention */
import NotAButton from '@components/not_a_button';
import './style/index.scss';
import color from '@assets/styles/color';
import TextPair from '@components/text_pair/TextPair';
import { Course, SemesterType } from '@services/dataTypes';
import TextButton from '@components/buttons/text_button';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import AddNewChapterModal from '@containers/modals/add_new_chapter_modal';
import PopoverText from '@components/popover_text';
import { useOverlayStore } from '@services/zustand/overlayStore';
import UpdateCourseModal from '@containers/modals/update_course_modal';
interface CourseOverviewProps {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  teacher: {
    name: string;
  };
  grade: {
    value: number;
  };
  subject: {
    name: string;
  };
  price: number;
  semester: SemesterType[];
  duration?: string;
  rating?: number;
  topRated: boolean;
  popular: boolean;
  createdAt: Date;
  course: Course;
}
export default function CourseOverview({
  id,
  title,
  description,
  image_url,
  teacher,
  grade,
  subject,
  price,
  semester,
  duration,
  rating,
  topRated,
  popular,
  createdAt,
  course,
}: CourseOverviewProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { modal, close } = useOverlayStore();

  const handleClickPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };
  console.log('image_url', image_url);
  const openPopover = Boolean(anchorEl);
  const idPopover = openPopover ? 'simple-popover' : undefined;
  return (
    <>
      <div className="course-overview">
        <div className="header-button-wrapper">
          <TextButton
            text="Edit main information"
            onPress={() => {
              modal(<UpdateCourseModal course={course} />, 'Update Course', {
                modalStyle: {
                  width: '80%',
                },
              }).open();
            }}
            Icon={<EditIcon css={{ color: 'white' }} />}
            backgroundColor={color.primary}
            fontColor={color.white}
          />
        </div>
        <div className="course-overview-content">
          <img src={`${image_url}?${new Date()}`} alt={title} />
          <div className="course-row">
            <TextPair
              first={{
                text: 'Title',
                fontColor: color.good_black,
                fontWeight: 600,
                fontSize: 14,
              }}
              second={{
                text: title,
                fontColor: color.textGray,
                fontWeight: 600,
                fontSize: 15,
              }}
              gap={5}
              alignItems="center"
            />
            <TextPair
              first={{
                text: 'Description',
                fontColor: color.good_black,
                fontWeight: 600,
                fontSize: 14,
              }}
              second={
                <button
                  aria-owns={openPopover ? 'simple-popover' : undefined}
                  aria-describedby={idPopover}
                  aria-haspopup="true"
                  onClick={handleClickPopover}
                  css={{
                    background: color.good_green,
                    color: 'white',
                    border: 'none',
                    padding: '5px 8px',
                    borderRadius: '8px',
                    marginTop: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Show description
                </button>
                // <TextButton
                //   text={'Show description'}

                //   aria-owns={openPopover ? 'simple-popover' : undefined}
                //   aria-describedby={idPopover}
                //   aria-haspopup="true"
                //   onPress={handleClickPopover}
                //   fontColor={color.white}
                //   fontSize={12}
                //   fontWeight={600}
                //   backgroundColor={color.good_green}
                //   padding={'5px 8px'}
                // />
              }
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
                text: teacher.name,
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
                text: grade.value,
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
                text: subject.name,
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
                text: price,
                fontColor: color.textGray,
                fontWeight: 600,
                fontSize: 15,
              }}
              gap={5}
              alignItems="center"
            />
            <TextPair
              first={{
                text: 'Duration',
                fontColor: color.good_black,
                fontWeight: 600,
                fontSize: 14,
              }}
              second={{
                text: duration ? duration : 'N/A',
                fontColor: color.textGray,
                fontWeight: 600,
                fontSize: 15,
              }}
              gap={5}
              alignItems="center"
            />
            <TextPair
              first={{
                text: 'Semester',
                fontColor: color.good_black,
                fontWeight: 600,
                fontSize: 14,
              }}
              second={{
                text: semester.join(', '),
                fontColor: color.textGray,
                fontWeight: 600,
                fontSize: 15,
              }}
              gap={5}
              alignItems="center"
            />
            <TextPair
              first={{
                text: 'Rating',
                fontColor: color.good_black,
                fontWeight: 600,
                fontSize: 14,
              }}
              second={{
                text: rating ? rating : 'N/A',
                fontColor: color.textGray,
                fontWeight: 600,
                fontSize: 15,
              }}
              gap={5}
              alignItems="center"
            />

            <TextPair
              first={{
                text: 'Created At',
                fontColor: color.good_black,
                fontWeight: 600,
                fontSize: 14,
              }}
              second={{
                text: new Date(createdAt).toLocaleDateString(),
                fontColor: color.textGray,
                fontWeight: 600,
                fontSize: 15,
              }}
              gap={5}
              alignItems="center"
            />
            {popular && topRated ? (
              <TextPair
                first={
                  <NotAButton
                    color={color.white}
                    backgroundColor={color.warm_orange}
                    text="Top Rated"
                    css={{ border: 'none' }}
                  />
                }
                second={
                  <NotAButton
                    color={color.white}
                    backgroundColor={color.hot_purple}
                    text="Popular"
                    css={{ border: 'none' }}
                  />
                }
                gap={5}
                alignItems="center"
              />
            ) : popular ? (
              <div className="button-wrapper">
                <NotAButton
                  color={color.white}
                  backgroundColor={color.hot_purple}
                  text="Popular"
                  css={{ border: 'none' }}
                />
              </div>
            ) : topRated ? (
              <div className="button-wrapper">
                <NotAButton
                  color={color.white}
                  backgroundColor={color.warm_orange}
                  text="Top Rated"
                  css={{ border: 'none' }}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <PopoverText
          text={description ? description : 'There is no description'}
          open={openPopover}
          id={`${idPopover}`}
          anchorEl={anchorEl}
          handleClose={handleClosePopover}
        />
      </div>
    </>
  );
}
