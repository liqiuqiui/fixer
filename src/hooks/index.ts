import api from '@/api';
import { useAppDispatch } from '@/store';
import { initLoginInfo, setNoticeList } from '@/store/slices/storeSlice';

export const useInitStore = () => {
  const appDispatch = useAppDispatch();
  return () => {
    api.getNoticeList({ pageSize: 99 }).then(res => {
      if (res.code === 200) {
        appDispatch(setNoticeList(res.data.list));
      }
    });
    appDispatch(initLoginInfo());
  };
};
