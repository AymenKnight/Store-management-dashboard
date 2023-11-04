import {  CreateVideo,  UpdateVideo,  video } from '@services/dataTypes';
import axiosClient from '../axios';


export const createVideoByLessonId = (
    videoData: CreateVideo,
  ): Promise<video[]> =>
    axiosClient
      .post('/video/create', videoData)
      .then((response) => response.data);

export const updateVideoByLessonId = (
    videoData: UpdateVideo,
  ): Promise<video[]> =>
    axiosClient
      .patch('/video', videoData)
      .then((response) => response.data);

export const deleteVideo = (videoData: {title: string, videoUrl: string, lessonId: string}) => {
    const requestData =  videoData ;  
    return axiosClient.delete('/video', { data: requestData });
  };