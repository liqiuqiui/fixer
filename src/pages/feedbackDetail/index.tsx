import { View } from '@tarojs/components';
import { FC } from 'react';
import styles from './index.module.scss';

const FeedbackDetail: FC = () => {
  return <View className={styles.feedbackDetail}>建议反馈详情</View>;
};

export default FeedbackDetail;

definePageConfig({ navigationBarTitleText: '建议反馈详情' });
