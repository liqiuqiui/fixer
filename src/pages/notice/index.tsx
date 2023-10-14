import { FC } from 'react';
import styles from './index.module.scss';
import { View, Text, Image } from '@tarojs/components';
import Router from 'tarojs-router-next';
import { useAppSelector } from '@/store';
import { formatTime } from '@/utils';

const NoticePage: FC = () => {
  const { noticeList } = useAppSelector(state => ({
    noticeList: state.store.noticeList,
  }));
  return (
    <View className={styles.notice}>
      <View className={styles.noticeList}>
        {noticeList.map(notice => {
          return (
            <View
              className={styles.noticeItem}
              onClick={() =>
                Router.toNoticeDetail({ params: { id: notice.id } })
              }
            >
              <View className={styles.left}>
                <Image src={notice.image} mode='aspectFill' />
              </View>
              <View className={styles.right}>
                <Text className={styles.title}>{notice.title}</Text>
                <Text className={styles.time}>
                  {formatTime(notice.createdTime)}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default NoticePage;

definePageConfig({
  navigationBarTitleText: '公告',
});
