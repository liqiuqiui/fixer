import { View, Text } from '@tarojs/components';
import classNames from 'classnames';
import { FC } from 'react';
import Router from 'tarojs-router-next';

import styles from './index.module.scss';

const FeedbackHome: FC = () => {
  return (
    <View className={styles.feedbackHome}>
      <View
        className={styles.feedbackItem}
        onClick={() => Router.toPostFeedback()}
      >
        <View className={styles.itemLeft}>
          <Text>提交反馈</Text>
          <Text>对报修平台存在的问题进行反馈</Text>
        </View>
        <Text
          className={classNames(
            styles.itemRight,
            'iconfont',
            'icon-arrow-right'
          )}
        ></Text>
      </View>
      <View className={styles.feedbackItem} onClick={() => Router.toFeedback()}>
        <View className={styles.itemLeft}>
          <Text>查看我的反馈</Text>
          <Text>之前的反馈都在这里哦</Text>
        </View>
        <Text
          className={classNames(
            styles.itemRight,
            'iconfont',
            'icon-arrow-right'
          )}
        ></Text>
      </View>
    </View>
  );
};

export default FeedbackHome;

definePageConfig({
  navigationBarTitleText: '建议反馈'
});
