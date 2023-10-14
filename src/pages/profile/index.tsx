import { View, Text, Image } from '@tarojs/components';
import { FC } from 'react';
import styles from './index.module.scss';
import api from '@/api';
import { useAppDispatch, useAppSelector } from '@/store';
import { defaultAvatar, logo, Role } from '@/constants';
import { Cell, CellGroup } from '@nutui/nutui-react-taro';
import Router from 'tarojs-router-next';
import Taro from '@tarojs/taro';
import { clearLoginInfo } from '@/store/slices/storeSlice';
import toast from '@/components/toast';
import { RoleEnum } from '@/constants';
import QQButton from '@/components/QQButton';

const Profile: FC = () => {
  const { userInfo, isLogin, isNormalUser, isRepairman } = useAppSelector(
    state => ({
      userInfo: state.store.userInfo,
      isLogin: !!state.store.token,
      isNormalUser: state.store.userInfo?.role === RoleEnum.user,
      isRepairman: state.store.userInfo?.role === RoleEnum.repairman,
    }),
  );

  const appDispatch = useAppDispatch();

  const handleLogin = async () => {
    if (isLogin) return;
    await api.login();
  };

  const handleLogout = () => {
    Taro.showModal({
      content: '确定要退出登录吗?',
      title: '提示',
      async success(result) {
        if (result.confirm) {
          appDispatch(clearLoginInfo());
          toast.success('退出登录成功');
        }
      },
    });
  };

  return isLogin ? (
    <View className={styles.profile}>
      <View
        className={styles.userInfo}
        style={`background-color:${isRepairman ? '#36c6a9' : '#2878ff'}`}
      >
        <View className={styles.left}>
          <Image src={userInfo?.avatarUrl ?? defaultAvatar} mode='aspectFill' />
        </View>
        <View className={styles.right}>
          <Text>
            {userInfo?.nickname ? userInfo?.nickname : userInfo?.name}
          </Text>
          <Text>{Role[userInfo?.role!]}</Text>
        </View>
      </View>

      <CellGroup>
        <Cell
          size='large'
          title=' 我的资料'
          iconSlot={<Text className='iconfont icon-gerenziliao'></Text>}
          isLink
          onClick={() => Router.toProfileDetail()}
        />

        <Cell
          size='large'
          title={isNormalUser ? ' 我的报修' : '我的维修单'}
          iconSlot={<Text className='iconfont icon-weixiudan'></Text>}
          isLink
          onClick={() => Router.toOrder()}
        />

        <Cell
          size='large'
          title=' 我的建议反馈'
          iconSlot={<Text className='iconfont icon-feedback'></Text>}
          isLink
          onClick={() => Router.toFeedback()}
        />
      </CellGroup>
      <View className={styles.logout} onClick={handleLogout}>
        退出登录
      </View>
    </View>
  ) : (
    <View className={styles.unLogin}>
      <View className={styles.logo}>
        <Image src={logo} />
      </View>
      <View className={styles.operation}>
        <QQButton
          size='large'
          className={styles.button}
          onClick={() => handleLogin()}
        >
          登录
        </QQButton>
        <QQButton
          hollow
          size='large'
          className={styles.button}
          onClick={() => Router.toRegister()}
        >
          注册
        </QQButton>
      </View>
    </View>
  );
};
export default Profile;

definePageConfig({
  navigationBarTitleText: '个人中心',
  usingComponents: {},
});
