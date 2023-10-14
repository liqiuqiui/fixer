import { View, Text } from '@tarojs/components';
import classNames from 'classnames';
import { FC } from 'react';
import Router from 'tarojs-router-next';
import styles from './index.module.scss';

const FixHome: FC = () => {
  return (
    <View className={styles.fixHome}>
      <View className={styles.item} onClick={() => Router.toPostOrder()}>
        <Text
          className={classNames(styles.left, 'iconfont', 'icon-baoxiu')}
        ></Text>
        <View className={styles.right}>
          <Text>立即报修</Text>
          <Text>在线智能报修，方便快捷</Text>
        </View>
      </View>
      <View className={styles.item} onClick={() => Router.toOrder()}>
        <Text
          className={classNames(styles.left, 'iconfont', 'icon-weixiudan')}
        ></Text>
        <View className={styles.right}>
          <Text>报修查询</Text>
          <Text>查询历史报修记录</Text>
        </View>
      </View>
      {/* <View className={styles.item}>
        <Text
          className={classNames(styles.left, 'iconfont', 'icon-kefu')}
        ></Text>
        <View className={styles.right}>
          <Text>联系我们</Text>
          <Text>遇到问题请联系我们</Text>
        </View>
      </View> */}
    </View>
  );
};

export default FixHome;

definePageConfig({
  navigationBarTitleText: '报修系统首页',
});
