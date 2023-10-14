import toast from '@/components/toast';
import { RoleEnum } from '@/constants';
import { useAppSelector } from '@/store';
import { formatTime } from '@/utils';
import { Swiper, SwiperItem } from '@nutui/nutui-react-taro';
import { View, Text, Image } from '@tarojs/components';
import classNames from 'classnames';
import { FC } from 'react';
import { Router } from 'tarojs-router-next';
import styles from './index.module.scss';

const Home: FC = () => {
  const { noticeList, focusNotice, isRepairman } = useAppSelector(state => ({
    noticeList: state.store.noticeList.slice(0, 2),
    focusNotice: state.store.noticeList.filter(v => v.focus),
    isRepairman: state.store.userInfo?.role === RoleEnum.repairman,
  }));

  const funList = [
    {
      title: '故障报修',
      subTitle: '解决故障问题',
      RouterTo: Router.toFixHome,
      bgClass: styles.fix,
      iconClass: 'icon-weixiu',
      userOnly: true,
    },
    {
      title: '建议反馈',
      subTitle: '提升平台建设',
      RouterTo: Router.toFeedbackHome,
      bgClass: styles.feedback,
      iconClass: 'icon-yijianxiang',
    },
    {
      title: '通知公告',
      subTitle: '查看近期通知',
      RouterTo: Router.toNotice,
      bgClass: styles.gonggao,
      iconClass: 'icon-gonggao',
    },
    {
      title: '报修记录',
      subTitle: '查看报修记录',
      RouterTo: Router.toOrder,
      bgClass: styles.orderList,
      iconClass: 'icon-jilu',
      userOnly: true,
    },
    {
      title: '维修单',
      subTitle: '浏览维修单',
      RouterTo: Router.toOrder,
      bgClass: styles.orderList,
      iconClass: 'icon-jilu',
      repairmanOnly: true,
    },
    {
      title: '更多功能',
      subTitle: '正在努力开发',
      RouterTo: () => {
        toast.show('一片荒芜, 啥也没有');
      },
      bgClass: styles.fix,
      iconClass: 'icon-shigong-xian',
      repairmanOnly: true,
    },
  ];

  return (
    <View className={styles.home}>
      <View className='wrap'>
        <Swiper
          className={styles.swiper}
          height={150}
          paginationColor='#426543'
          autoPlay='3000'
          paginationVisible
        >
          {focusNotice.map(notice => {
            return (
              <SwiperItem>
                <img
                  onClick={() =>
                    Router.toNoticeDetail({ params: { id: notice.id } })
                  }
                  height='150px'
                  width='100vw'
                  src={notice.image}
                  alt=''
                />
              </SwiperItem>
            );
          })}
        </Swiper>

        <View className={styles.fun}>
          {funList.map(fun => {
            return (fun.userOnly && isRepairman) ||
              (fun.repairmanOnly && !isRepairman) ? (
              <></>
            ) : (
              <View
                className={classNames(styles.funItem, fun.bgClass)}
                onClick={() => fun.RouterTo()}
              >
                <View className={styles.left}>
                  <Text
                    className={classNames('iconfont', fun.iconClass)}
                  ></Text>
                </View>
                <View className={styles.right}>
                  <Text>{fun.title}</Text>
                  <Text>{fun.subTitle}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
      <View className={classNames(styles.notice, 'wrap')}>
        <View className={styles.head}>
          <Text>最新资讯</Text>
          <View style='color: #ccc' onClick={() => Router.toNotice()}>
            更多 {'>'}
          </View>
        </View>
        <View className={styles.noticeList}>
          {noticeList.map(notice => {
            return (
              <View
                className={styles.noticeItem}
                onClick={() =>
                  Router.toNoticeDetail({
                    params: {
                      id: notice.id,
                    },
                  })
                }
              >
                <View className={styles.left}>
                  <Image src={notice.image} />
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
    </View>
  );
};

export default Home;

definePageConfig({
  navigationBarTitleText: '首页',
  usingComponents: {},
});
