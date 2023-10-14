import dayjs from 'dayjs';

// export const wxLogin = () => {};
export const formatTime = (
  time: Date | string = '',
  format = 'YYYY-MM-DD HH:mm:ss',
) => dayjs(time).format(format);

export const isVideoURL = (url: string) => {
  return ['.mp4', '.3gp', '.m3u8', 'webm'].some(suffix => url.endsWith(suffix));
};
