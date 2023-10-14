import { useAppSelector } from '@/store';
import { formatTime } from '@/utils';
import { View, Text, Image, RichText } from '@tarojs/components';
import { useRouter } from '@tarojs/taro';
import { FC } from 'react';
import styles from './index.module.scss';
import { Params } from './route.config';
import '@/assets/css/quill.bubble.css';
import '@/assets/css/quill.core.css';
import '@/assets/css/quill.snow.css';

const NoticeDetail: FC = () => {
  const route = useRouter<Params>();
  const notice = useAppSelector(state =>
    state.store.noticeList.find(v => v.id === +route.params.id),
  );
  return (
    <View className={styles.noticeDetail}>
      <View className={styles.title}>{notice?.title}</View>
      <View className={styles.desc}>
        <Text>通知公告</Text>|<Text>{formatTime(notice?.createdTime)}</Text>
      </View>
      <Image src={notice?.image!} mode='widthFix' />
      <RichText nodes={notice?.content} className='ql-editor'></RichText>
    </View>
  );
};

export default NoticeDetail;

definePageConfig({
  navigationBarTitleText: '公告详情',
});
