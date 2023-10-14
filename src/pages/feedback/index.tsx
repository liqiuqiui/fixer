import api from '@/api';
import { formatTime, isVideoURL } from '@/utils';
import { Empty, TabPane, Tabs } from '@nutui/nutui-react-taro';
import { View, Text, Image, Video } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import { FC, useEffect, useState } from 'react';
import styles from './index.module.scss';
import { FeedbackState } from '@/constants';

const paneList: FeedbackPane[] = [
  {
    title: '全部',
    state: undefined,
    list: [],
  },
  {
    title: '待处理',
    list: [],
    state: 0,
  },
  {
    title: '已处理',
    state: 1,
    list: [],
  },
];
const feedbackMap = [
  { name: '待处理', class: styles.pendding },
  { name: '已处理', class: styles.resolve },
];

const Feedback: FC = () => {
  const [feedbackPane, setFeedbackPane] = useState<FeedbackPane[]>();

  const [tabValue, setTabValue] = useState<OrderState>(0);

  const getFeedbackList = async () => {
    const feedBackRes = await api.getFeedbackList({ pageSize: 999 });
    if (feedBackRes.code === 200) {
      const allList = feedBackRes.data.list;
      setFeedbackPane(
        paneList.map(pane => {
          if (pane.state === undefined) {
            pane.list = allList;
          } else {
            pane.list = allList.filter(v => v.state === pane.state);
          }
          return pane;
        }),
      );
    }
  };
  useEffect(() => {
    getFeedbackList();
  }, []);
  return (
    <View className={styles.feedback}>
      <Tabs
        background='#fff'
        color='#2878ff'
        value={tabValue}
        onChange={t => {
          setTabValue(t.index as OrderState);
        }}
        type='smile'
      >
        {feedbackPane?.map((pane, idx) => {
          return (
            <TabPane title={pane.title} paneKey={idx} key={pane.title}>
              {pane.list.length <= 0 ? (
                <Empty description='暂无反馈信息' />
              ) : (
                pane.list.map(feedback => (
                  <View className={styles.feedbackItem}>
                    <View className={styles.itemInfo}>
                      <Text className={styles.label}>状态:</Text>
                      <Text
                        className={classNames(
                          styles.value,
                          feedbackMap[feedback.state].class,
                        )}
                      >
                        {feedbackMap[feedback.state].name}
                      </Text>
                    </View>
                    <View className={styles.itemInfo}>
                      <Text className={styles.label}>反馈人:</Text>
                      <Text className={styles.value}>
                        {feedback.name ?? feedback.user.name}
                      </Text>
                    </View>
                    <View className={styles.itemInfo}>
                      <Text className={styles.label}>反馈时间:</Text>
                      <Text className={styles.value}>
                        {formatTime(feedback.createdTime)}
                      </Text>
                    </View>
                    <View className={styles.itemInfo}>
                      <Text className={styles.label}>反馈内容:</Text>
                      <Text className={styles.value}>{feedback.desc}</Text>
                    </View>
                    {feedback.images?.length! > 0 && (
                      <View className={classNames(styles.row, styles.imageRow)}>
                        <View className={styles.imageList}>
                          {feedback?.images?.map(img => {
                            return (
                              <View className={styles.imageItem}>
                                {isVideoURL(img.url) ? (
                                  <Video
                                    className={styles.video}
                                    showMuteBtn
                                    controls
                                    src={img.url}
                                    muted
                                  />
                                ) : (
                                  <Image
                                    src={img.url}
                                    mode='aspectFill'
                                    onClick={() => {
                                      Taro.previewImage({
                                        current: img.url,
                                        urls: feedback.images?.map(v => v.url)!,
                                      });
                                    }}
                                  />
                                )}
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    )}
                    {feedback.state === FeedbackState.resolve && (
                      <View className={styles.itemInfo}>
                        <Text className={styles.label}>处理结果:</Text>
                        <Text className={styles.value}>{feedback.reply}</Text>
                      </View>
                    )}
                  </View>
                ))
              )}
            </TabPane>
          );
        })}
      </Tabs>
    </View>
  );
};

export default Feedback;

definePageConfig({
  navigationBarTitleText: '我的建议反馈',
});
