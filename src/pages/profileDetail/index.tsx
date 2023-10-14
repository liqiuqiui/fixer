import api from '@/api';
import SubmitButton from '@/components/submitButton';
import toast from '@/components/toast';
import { BASE } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/store';
import { setLoginInfo } from '@/store/slices/storeSlice';
import { View, Input, Image, Button, InputProps } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import { FC, useEffect, useState } from 'react';
import styles from './index.module.scss';

const ProfileDetail: FC = () => {
  const userInfo = useAppSelector(state => state.store.userInfo);
  const dispatch = useAppDispatch();
  useEffect(() => {
    console.log('store userInfo', userInfo);
  }, [userInfo]);

  const [patchUserInfoData, setPatchUserInfoData] = useState<PatchUserInfoData>(
    {},
  );

  const infoRow: {
    label: string;
    key: string;
    type: InputProps['type'];
    maxLength: number;
  }[] = [
    {
      label: '姓名',
      key: 'name',
      type: 'text',
      maxLength: 10,
    },
    {
      label: '昵称',
      key: 'nickname',
      type: 'nickname',
      maxLength: 20,
    },
    {
      label: '手机号',
      key: 'phone',
      maxLength: 11,
      type: 'number',
    },
  ];

  const hdnaleSubmit = () => {
    if (Object.keys(patchUserInfoData).length < 1) {
      toast.show('资料未更改');
      return;
    }

    api.patchUserInfo(patchUserInfoData).then(res => {
      if (res.code === 200) {
        console.log(res.data);

        dispatch(setLoginInfo({ userInfo: res.data }));
        toast.success('资料更新成功');
        setPatchUserInfoData({});
      }
    });
    console.log(patchUserInfoData);
  };

  return (
    <View className={styles.profileDetail}>
      <View className={styles.row}>
        <View className={styles.left}>头像</View>
        <View className={styles.right}>
          <View className={styles.avatar}>
            <Image
              mode='aspectFill'
              className={styles.img}
              src={patchUserInfoData?.avatarUrl ?? userInfo?.avatarUrl!}
            />
            <View className={styles.mask}>编辑</View>
            <Button
              onChooseAvatar={async e => {
                const uploadRes = await Taro.uploadFile({
                  url: BASE + '/api/v1/upload',
                  name: 'images',
                  filePath: e.detail.avatarUrl,
                });
                const res = JSON.parse(uploadRes.data);
                if (res.code === 201) {
                  setPatchUserInfoData(pre => ({
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
                maxlength={info.maxLength}
                type={info.type}
                className={classNames(styles.input)}
                placeholder={'请输入' + info.label}
                value={patchUserInfoData![info.key] ?? userInfo![info.key]}
                onInput={e => {
                  setPatchUserInfoData(pre => ({
                    ...pre,
                    [info.key]: e.detail.value,
                  }));
                }}
              />
            </View>
          </View>
        );
      })}

      <SubmitButton onClick={hdnaleSubmit} />
    </View>
  );
};

export default ProfileDetail;

definePageConfig({
  navigationBarTitleText: '我的资料',
});
