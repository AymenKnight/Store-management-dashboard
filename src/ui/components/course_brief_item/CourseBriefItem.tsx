/* eslint-disable @typescript-eslint/naming-convention */
import MemberItem from '@components/member_item';
import './style/index.scss';
import TextPair from '@components/text_pair/TextPair';
import color from '@assets/styles/color';
import { SemesterType } from '@services/dataTypes';
interface CourseBriefItemProps {
  title: string;
  id: string;
  teacherName: string;
  grade: number;
  subject: string;
  semester: SemesterType[];
  image_url?: string;
  price: number;
}
export default function CourseBriefItem({
  title,
  id,
  teacherName,
  grade,
  subject,
  semester,
  image_url,
  price,
}: CourseBriefItemProps) {
  return (
    <div className="course-brief-item">
      <MemberItem name={title} id={id} maxTextWidth={120} />
      <TextPair
        first={{
          text: 'Teacher',
          fontColor: color.good_black,
          fontSize: 14,
          fontWeight: 600,
        }}
        second={{
          text: teacherName,
          fontColor: color.textGray,
          fontSize: 14,
          fontWeight: 600,
        }}
        alignItems="center"
        gap={5}
      />
      <TextPair
        first={{
          text: 'Grade',
          fontColor: color.good_black,
          fontSize: 14,
          fontWeight: 600,
        }}
        second={{
          text: grade,
          fontColor: color.textGray,
          fontSize: 14,
          fontWeight: 600,
        }}
        alignItems="center"
        gap={5}
      />
      <TextPair
        first={{
          text: 'Subject',
          fontColor: color.good_black,
          fontSize: 14,
          fontWeight: 600,
        }}
        second={{
          text: subject,
          fontColor: color.textGray,
          fontSize: 14,
          fontWeight: 600,
        }}
        alignItems="center"
        gap={5}
      />
      <TextPair
        first={{
          text: 'Semester',
          fontColor: color.good_black,
          fontSize: 14,
          fontWeight: 600,
        }}
        second={{
          text: semester.sort().join(', '),
          fontColor: color.textGray,
          fontSize: 14,
          fontWeight: 600,
        }}
        alignItems="center"
        gap={5}
      />
      <TextPair
        first={{
          text: 'Price',
          fontColor: color.good_black,
          fontSize: 14,
          fontWeight: 600,
        }}
        second={{
          text: price,
          fontColor: color.textGray,
          fontSize: 14,
          fontWeight: 600,
        }}
        alignItems="center"
        gap={5}
      />
    </div>
  );
}
