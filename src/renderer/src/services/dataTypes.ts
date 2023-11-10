/* eslint-disable @typescript-eslint/naming-convention */
export interface Student {
  name: string;
  avatar_url?: string;
  email: string;
  id: string;
  phone_number: string;
  online_status: boolean;
  subject: {
    id: string;
    name: string;
    image_url: string;
    gradeId: string;
  };
  grade: {
    id: string;
    value: number;
  };
  role: string;
}
export type PaymentMode = 'CIB' | 'EDAHABIA' | 'CCP';
export type PaymentStatus = 'pending' | 'paid' | 'canceled';
export enum SemesterType {
  SEMESTER_1,
  SEMESTER_2,
  SEMESTER_3,
}

export interface Teacher {
  name: string;
  email: string;
  id: string;
  role: string;
  online_status: boolean;
  phone_number?: string;
  avatar_url?: string;
}

export interface CreateUser {
  name: string;
  email: string;
  password: string;
  role: string;
  phone_number: string;
  gradeId?: string;
  subjectId?: string;
  file?: FileList;
}

export interface SubjectRes {
  id: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  image_url: string;
  name: string;
}

export interface ChapterRes {
  id: string;
  title: string;
  course_id: string;
  order_number: number;
}

export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  order_number: number;
  lessons: lesson[];
}

export interface lesson {
  id: string;
  title: string;
  chapter_id: string;
  order_number: number;
  createdAt: string;
  updatedAt: string;
  materials: material[];
  video?: video;
  quizzes: quiz[];
}

export interface material {
  id: string;
  title: string;
  content: string;
  lesson_id: string;
}

export interface video {
  id: string;
  title: string;
  url: string;
  lesson_id: string;
  questions: question[];
}

export interface question {
  id: string;
  description: string;
  quiz_id: string;
  answers: answer[];
}

export interface answer {
  id: string;
  description: string;
  is_correct: boolean;
  question_id: string;
}

export interface quiz {
  id: string;
  title: string;
  lesson_id: string;
  questions: question[];
}

export interface Subject {
  gradeId: string;
  file: File;
  name: string;
}

export interface Grades {
  id: string;
  value: number;
}
export interface Course {
  id: string;
  title: string;
  description?: string;
  teacher: {
    id: string;
    email: string;
    name: string;
    overallRating?: number;
    numOfCourses?: number;
    numOfStudents?: number;
    avatar_url?: string;
  };
  price: number;
  semester: SemesterType[];
  duration?: string; //TODO add duration in course creation
  rating?: number;
  image_url?: string;
  topRated?: boolean;
  popular?: boolean;
  grade: {
    id: string;
    value: number;
  };
  subject: {
    id: string;
    name: string;
    image_url: string;
    gradeId: string;
  };
  enrollIndCount: number;
  createdAt: Date;
  updatedAt: Date;
  chapters: Chapter[];
}

export interface OffresRes {
  id: string;
  title: string;
  description: string;
  discount: number;
  end_date: string;
  offer_type: string;
  createdAt: string;
  updatedAt: string;
  courses: Course[];
}

export interface Offres {
  title: string;
  description: string;
  type: string;
  discountAmount: number;
  expirationDate: string;
  courses: string[];
}

export interface CreateCoupon {
  title: string;
  description: string;
  type: string;
  discountAmount: number;
  expirationDate: string;
  max_uses: number;
  courses?: string[];
}
export interface CreateOffer {
  title: string;
  description: string;
  type: string;
  discountAmount: number;
  expirationDate: string;
  courses?: string[];
}

export interface CouponRes {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: number;
  end_date: string;
  max_uses: number;
  offer_type: string;
  createdAt: string;
  updatedAt: string;
  courses: Course[];
  userCoupon: {
    id: string;
    isUsed: boolean;
    usedAt: Date;
    user: {
      id: string;
      email: string;
      name: string;
      avatar_url: string;
    };
  }[];
}

export interface Coupons {
  title: string;
  description: string;
  type: string;
  discountAmount: number;
  expirationDate: string;
  max_uses: number;
  courses: string[];
}

export interface Order {
  id: string;
  client: {
    id: string;
    name: string;
    avatar?: string;
  };
  amount: number;
  invoice_number: string;
  mode: PaymentMode;
  document_url?: string;
  couponId?: string;
  status: PaymentStatus;
  course: Pick<Course, 'id' | 'title' | 'description' | 'teacher' | 'price'>[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrder {
  client: string[];
  amount: number;
  mode: PaymentMode;
  courses: string[];
  file: FileList;
  imageEnabled: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

export interface AdminUpdate {
  name: string;
  email: string;
  password?: string;
  file?: FileList;
  gradeId?: string;
  subjectId?: string;
}

export interface StudentUpdate {
  name?: string;
  email?: string;
  password?: string;
  phone_number?: string;
  file?: FileList;
  gradeId?: string;
  subjectId?: string;
  role?: string;
}

export interface TeacherUpdate {
  name?: string;
  email?: string;
  password?: string;
  phone_number?: string;
  file?: FileList;
  role?: string;
}

export interface GenericResponse {
  status: string;
  message: string;
}

export interface LoginResponse {
  status: string;
  accessToken: string;
  refreshToken: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  user_id: string;
  email: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  avatar_url?: string;
}

export interface IUserResponse {
  status: string;
  data: {
    user: User;
  };
}

export interface CoursesSelect {
  id: string;
  title: string;
  subject: string;
  semester: SemesterType;
  description?: string;
  grade: number;
}

export interface CreateChapter {
  title: string;
  order_number?: number;
  courseId: string;
}

export interface UpdateChapter {
  title?: string;
  order_number?: number;
  chapterId: string;
}

export interface userCourse {
  id: string;
  course_id: string;
  learner_id: string;
  status: string;
  enrolled_date: Date;
}

export interface addEnrollment {
  learnerId: string;
  courseId: string;
}

export interface CreateLesson {
  title: string;
  order_number?: number;
  chapterId: string;
}

export interface UpdateLesson {
  title?: string;
  order_number?: number;
  lessonId: string;
}

export interface CreateVideo {
  title: string;
  videoUrl: string;
  lessonId: string;
}

export interface UpdateVideo {
  title?: string;
  videoUrl?: string;
  lessonId: string;
}

export interface CreateMaterial {
  title: string;
  content: string;
  lessonId: string;
}

export interface UpdateMaterial {
  title?: string;
  content?: string;
  lessonId: string;
  materialId: string;
}

export interface CreateQuizQuestion {
  description: string;
  quizId: string;
  answers: {
    description: string;
    is_correct: boolean;
  }[];
}

export interface CreateQuiz {
  lessonId: string;
  title: string;
  questions: question[];
}
