import { FC, useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import { useRouter } from '@tarojs/taro';
import api, { getOrderById } from '@/api';
import classNames from 'classnames';
import { TextArea } from '@nutui/nutui-react-taro';
import SubmitButton from '@/components/submitButton';
import toast from '@/components/toast';
import Router from 'tarojs-router-next';

const OrderComment: FC = () => {
  const { params } = useRouter();

  const orderId = +((params.id as unknown) as number);
  if (typeof orderId !== 'number') {
    toast.fail('非法访问页面');
    Router.back();
    return <></>;
  }

  const [postCommentData, setPostCommentData] = useState<PostCommentData>({
    comment: '',
    star: 0,
  });

  const commentDescMap = ['非常差', '差', '一般', '好', '非常好'];
  const handleSubmit = () => {
    if (postCommentData.star < 1) {
      toast.show('打星不得低于1星', { duration: 800 });
      return;
    }
    if (postCommentData.comment.length < 2) {
      toast.show('内容不得低于2个字符', { duration: 800 });
      return;
    }
    api.postComment(orderId, postCommentData).then(res => {
      if (res.code === 200) {
        toast.success('提交成功');
        setTimeout(() => {
          Router.back(true);
        }, 1500);
      } else {
        toast.fail('提交失败');
      }
    });
  };

  return (
    <View className={styles.orderComment}>
      <View className={styles.row}>
        <View className={styles.label}>维修评价</View>
        <View className={styles.star}>
          {new Array(5).fill(0).map((_v, idx) => {
            return (
              <Text
                className={classNames(
                  'iconfont',
                  idx < postCommentData.star! ? 'icon-star-fill' : 'icon-star',
                )}
                onClick={() => {
                  setPostCommentData(pre => ({ ...pre, star: idx + 1 }));
                }}
              ></Text>
            );
          })}
        </View>
        <View style='font-size:24rpx;color:#aaa'>
          {postCommentData.star > 0 && commentDescMap[postCommentData.star - 1]}
        </View>
      </View>
      <TextArea
        placeholder='请输入对本次维修的评价'
        defaultValue=''
        limitshow
        maxlength='120'
        onChange={comment => setPostCommentData(pre => ({ ...pre, comment }))}
      />
      <SubmitButton onClick={handleSubmit} />
    </View>
  );
};

export default OrderComment;
definePageConfig({ navigationBarTitleText: '评价维修订单' });
