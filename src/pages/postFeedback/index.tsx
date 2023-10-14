import api from '@/api';
import SubmitButton from '@/components/submitButton';
import toast from '@/components/toast';
import { BASE } from '@/constants';
import { useAppSelector } from '@/store';
import { Input, TextArea } from '@nutui/nutui-react-taro';
import { View, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import { FC, useState } from 'react';
import Router from 'tarojs-router-next';
import styles from './index.module.scss';

const PostFeedBack: FC = () => {
  const { userInfo } = useAppSelector(state => ({
    userInfo: state.store.userInfo,
  }));
  const [postFeedbackData, setPostFeedbackData] = useState<PostFeedbackData>({
    name: userInfo?.name ?? '',
    phone: userInfo?.phone ?? '',
    desc: '',
    images: [],
  });

  const handleUploadImage = async () => {
    const uploadRes = await api.uploadMedia({
      mediaType: ['image'],
      count: 9 - (postFeedbackData.images?.length ?? 0),
    });
    if (uploadRes.code === 201) {
      setPostFeedbackData(pre => ({
        ...pre,
        images: [...pre.images!, ...uploadRes.data.map(v => BASE + v.url)],
      }));
    } else {
      toast.fail('图片上传失败!');
    }
  };

  const handleSubmit = () => {
    api.postFeedback(postFeedbackData).then(res => {
      if (res.code === 201) {
        toast.success('提交反馈成功');
        setTimeout(() => {
          Router.toFeedback();
        }, 1500);
      }
    });
  };

  return (
    <View className={styles.postFeedback}>
      <Input
        label='姓名：'
        labelAlign='left'
        labelWidth='70'
        defaultValue={postFeedbackData?.name}
        placeholder='请输入姓名'
        change={val => {
          setPostFeedbackData(pre => ({ ...pre, name: val }));
        }}
      />
      <Input
        type='tel'
        label='手机号码：'
        labelAlign='left'
        labelWidth='70'
        defaultValue={postFeedbackData.phone}
        placeholder='请输入手机号'
        change={val => {
          setPostFeedbackData(pre => ({ ...pre, phone: val }));
        }}
      />

      <View className={styles.feedbackDesc}>
        <View>反馈说明:</View>
        <TextArea
          className={styles.textArea}
          placeholder='请填写您的宝贵意见'
          onChange={value => {
            setPostFeedbackData(pre => ({ ...pre, desc: value }));
          }}
        ></TextArea>
      </View>

      <View className={styles.imageUpload}>
        <View className={styles.label}>上传反馈图片</View>
        <View className={styles.tip}>
          请确保图片的清晰度({postFeedbackData.images?.length ?? 0}/9)
        </View>
        <View className={styles.imageList}>
          {postFeedbackData.images?.map(url => {
            return (
              <View className={styles.imageItem}>
                <Image
                  webp
                  src={url}
                  mode='aspectFill'
                  onClick={() => {
                    Taro.previewImage({
                      current: url,
                      urls: postFeedbackData.images!,
                    });
                  }}
                />
                <View
                  className={styles.remove}
                  onClick={() => {
                    Taro.showModal({
                      title: '提示',
                      content: '是否要删除该图片？',
                      showCancel: true,
                      success(res) {
                        if (res.confirm)
                          setPostFeedbackData(pre => ({
                            ...pre,
                            images: pre?.images?.filter(v => v !== url),
                          }));
                      },
                    });
                  }}
                >
                  <Text className='iconfont icon-close'></Text>
                </View>
              </View>
            );
          })}
          {postFeedbackData.images?.length! < 9 && (
            <View
              className={classNames(styles.choose, styles.imageItem)}
              onClick={handleUploadImage}
            >
              <Text className='iconfont icon-upload'></Text>
            </View>
          )}
        </View>
      </View>
      <SubmitButton onClick={handleSubmit} />
    </View>
  );
};

export default PostFeedBack;

definePageConfig({
  navigationBarTitleText: '提交反馈',
});
