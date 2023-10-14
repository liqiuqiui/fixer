import api from '@/api';
import SubmitButton from '@/components/submitButton';
import QQButton from '@/components/QQButton';
import toast from '@/components/toast';
import { BASE, defaultAvatar, RoleEnum } from '@/constants';
import { View, Button, Input, Image, InputProps } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import { useState } from 'react';
import styles from './index.module.scss';

type InfoRow = {
  label: string;
  key: string;
} & InputProps;

const infoRow: InfoRow[] = [
  {
    label: '昵称',
    key: 'nickname',
    type: 'nickname',
    maxlength: 20,
    placeholder: '请输入昵称',
  },

  {
    label: '学/工号',
    key: 'userNo',
    type: 'text',
    placeholder: '请输入学/工号匹配信息',
  },
];

const matchedKeys = [
  { key: 'name', text: '姓名' },
  { key: 'phone', text: '手机号' },
  { key: 'academyName', text: '学院' },
  { key: 'majorName', text: '专业' },
  { key: 'className', text: '班级' },
];

const Register: React.FC = () => {
  const [postUserInfoData, setPostUserInfoData] = useState<
    Omit<RegisterData, 'code'>
  >({ avatarUrl: defaultAvatar });

  const [matchedUser, setMatchedUser] = useState<Partial<User>>({});

  const hdnaleRegister = async () => {
    console.log('postUserInfoData', postUserInfoData);
    if (
      !postUserInfoData.nickname ||
      !postUserInfoData.nickname ||
      !matchedUser.userNo
    )
      return toast.show('请将注册信息填写完整');
    await api.register(postUserInfoData);
  };

  return (
    <View className={styles.register}>
      <View className={styles.row}>
        <View className={styles.left}>头像</View>
        <View className={styles.right}>
          <View className={styles.avatar}>
            <Image
              mode='aspectFill'
              className={styles.img}
              src={postUserInfoData?.avatarUrl!}
            />
            <View className={styles.mask}>上传</View>
            <Button
              onChooseAvatar={async e => {
                const uploadRes = await Taro.uploadFile({
                  url: BASE + '/api/v1/upload',
                  name: 'images',
                  filePath: e.detail.avatarUrl,
                });
                const res = JSON.parse(uploadRes.data);
                if (res.code === 201) {
                  setPostUserInfoData(pre => ({
                    ...pre,
                    avatarUrl: BASE + res.data[0].url,
                  }));
                } else {
                  toast.fail('图片上传失败!');
                }
              }}
              openType='chooseAvatar'
              className={styles.choose}
            ></Button>
          </View>
        </View>
      </View>
      {infoRow.map(info => {
        return (
          <View className={styles.row}>
            <View className={styles.left}>{info.label}</View>
            <View className={styles.right}>
              <Input
                {...info}
                className={classNames(styles.input)}
                value={postUserInfoData![info.key]}
                onInput={e => {
                  setPostUserInfoData(pre => ({
                    ...pre,
                    [info.key]: e.detail.value,
                  }));
                }}
              />
              {info.key === 'userNo' && (
                <QQButton
                  size='mini'
                  onClick={() => {
                    if (!postUserInfoData.userNo)
                      return toast.show('请输入学/工号');

                    api.matchUser(postUserInfoData?.userNo!).then(res => {
                      if (res.code === 200) {
                        toast.success('信息匹配成功');
                        setMatchedUser(res.data);
                        return;
                      }
                      setMatchedUser({});
                    });
                  }}
                >
                  匹配信息
                </QQButton>
              )}
            </View>
          </View>
        );
      })}
      {matchedUser.userNo && (
        <>
          <View style='color:#2878ff;font-size:28rpx' className={styles.row}>
            请仔细核对以下信息是否正确
          </View>
          {matchedKeys.map(
            matched =>
              matchedUser[matched.key] && (
                <View className={styles.row}>
                  <View className={styles.left}>{matched.text}</View>
                  <View className={styles.right}>
                    <View className={classNames(styles.input)}>
                      {matchedUser[matched.key]}
                    </View>
                  </View>
                </View>
              ),
          )}
        </>
      )}

      <SubmitButton onClick={hdnaleRegister} />
    </View>
  );
};

definePageConfig({ navigationBarTitleText: '注册' });

export default Register;
