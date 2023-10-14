import api from '@/api';
import { Empty, TabPane, Tabs } from '@nutui/nutui-react-taro';
import { View, Text } from '@tarojs/components';
import { FC, useEffect, useState } from 'react';
import styles from './index.module.scss';
import Router from 'tarojs-router-next';
import { OrderState } from '@/constants';
import classNames from 'classnames';
import { formatTime } from '@/utils';
import { useAppSelector } from '@/store';
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro';
import { RoleEnum } from '@/constants';
import CallButton from '@/components/callButton';
import QQButton from '@/components/QQButton';

let paneList: OrderPane[] = [
  {
    title: '全部',
    state: undefined,
    list: [],
    role: [RoleEnum.repairman, RoleEnum.user],
  },
  {
    title: '待审核',
    state: 0,
    list: [],
    role: [RoleEnum.user],
  },
  {
    title: '审核通过',
    state: 1,
    list: [],
    role: [RoleEnum.user],
  },
  {
    title: '被驳回',
    state: 2,
    list: [],
    role: [RoleEnum.user],
  },
  {
    title: '已派单',
    state: 3,
    list: [],
    role: [RoleEnum.user],
  },
  {
    title: '待维修',
    state: 3,
    list: [],
    role: [RoleEnum.repairman],
  },
  {
    title: '已完成',
    state: 4,
    list: [],
  },
];
const Order: FC = () => {
  const { userInfo, isNormalUser, isRepairman } = useAppSelector(
    ({ store: { userInfo } }) => ({
      userInfo,
      isNormalUser: userInfo?.role === RoleEnum.user,
      isRepairman: userInfo?.role === RoleEnum.repairman,
    }),
  );

  const [tabValue, setTabValue] = useState<OrderState>(0);

  const [orderPane, setOrderPane] = useState<OrderPane[]>();

  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: isRepairman ? '我的维修单' : '我的报修',
    });
  }, [isRepairman]);

  const getOrderList = async () => {
    const orderRes = await api.getOrderList({ pageSize: 999 });
    if (orderRes.code === 200) {
      const allList = orderRes.data.list;
      setOrderPane(
        paneList
          .filter(v =>
            v.role !== undefined ? v.role.includes(userInfo?.role!) : v,
          )
          .map(pane => {
            if (pane.state === undefined) {
              pane.list = allList;
            } else {
              pane.list = allList.filter(v => v.state === pane.state);
            }
            return pane;
          }),
      );
    }
    Taro.stopPullDownRefresh();
  };

  useDidShow(() => {
    getOrderList();
  });
  usePullDownRefresh(() => {
    getOrderList();
  });

  const orderState = ['待审核', '审核通过', '被驳回', '已派单', '已完成'];

  return (
    <View className={styles.myRepaireReport}>
      <Tabs
        background='#fff'
        color='#2878ff'
        value={tabValue}
        onChange={t => setTabValue(t.index)}
        type='smile'
      >
        {orderPane?.map((pane, idx) => {
          return (
            <TabPane title={pane.title} paneKey={idx} key={pane.title}>
              {pane.list.length <= 0 ? (
                <Empty
                  description={`暂无${isRepairman ? '维' : '报'}修订单信息`}
                />
              ) : (
                pane.list.map(order => (
                  <View className={styles.orderItem}>
                    <View
                      className={styles.wrap}
                      onClick={() => {
                        console.log('去维修单详情');
                        Router.toOrderDetail({ params: { id: order.id } });
                      }}
                    >
                      <View
                        className={styles.itemInfo}
                        style='font-weight: bold;'
                      >
                        <Text className={styles.label}>维修单号:</Text>
                        <Text className={styles.value}>
                          {order.orderNo.split('-')[0]}
                        </Text>
                      </View>
                      <View style='border-top: 1rpx solid #eee'></View>
                      <View className={styles.itemInfo}>
                        <Text className={styles.label}>报修人:</Text>
                        <Text className={styles.value}>
                          {order.name ?? order.user.name}
                        </Text>
                      </View>
                      {isRepairman && (
                        <View className={styles.itemInfo}>
                          <Text className={styles.label}>手机号:</Text>
                          <View
                            className={styles.value}
                            style='display: flex; align-items: center; column-gap: 6rpx'
                          >
                            <Text>{order.phone ?? order.user.phone}</Text>
                            {order.state === OrderState.assigned && (
                              <CallButton phone={order.phone} />
                            )}
                          </View>
                        </View>
                      )}
                      <View className={styles.itemInfo}>
                        <Text className={styles.label}>报修地址:</Text>
                        <Text className={styles.value}>
                          {order.address.map(v => v.name).join(' ')}
                        </Text>
                      </View>
                      <View className={styles.itemInfo}>
                        <Text className={styles.label}>报修时间:</Text>
                        <Text className={styles.value}>
                          {formatTime(order.createdTime)}
                        </Text>
                      </View>
                      <View className={styles.itemInfo}>
                        <Text className={styles.label}>预约时间:</Text>
                        <Text className={styles.value}>
                          {formatTime(order.expectTime)}
                        </Text>
                      </View>
                      <View className={styles.itemInfo}>
                        <Text className={styles.label}>故障描述:</Text>
                        <Text className={styles.value}>{order.desc}</Text>
                      </View>
                      <View className={styles.itemInfo}>
                        <Text className={styles.label}>订单状态:</Text>
                        <Text className={styles.value}>
                          {isRepairman && order.state === OrderState.assigned
                            ? '待维修'
                            : orderState[order.state]}
                        </Text>
                      </View>
                      {order.state === OrderState.fail && (
                        <View className={styles.itemInfo}>
                          <Text className={styles.label}>驳回原因:</Text>
                          <Text className={styles.value}>{order.reason}</Text>
                        </View>
                      )}
                      {isNormalUser && order.state >= OrderState.assigned && (
                        <View className={styles.itemInfo}>
                          <Text className={styles.label}>维修工:</Text>
                          <Text className={styles.value}>
                            {order.repairman?.name}
                          </Text>
                        </View>
                      )}
                      {order.state === OrderState.finish && (
                        <View className={styles.itemInfo}>
                          <Text className={styles.label}>维修时间:</Text>
                          <Text className={styles.value}>
                            {formatTime(order.fixTime)}
                          </Text>
                        </View>
                      )}
                      {order.state === OrderState.finish && (
                        <View className={styles.itemInfo}>
                          <Text className={styles.label}>维修结果:</Text>
                          <Text className={styles.value}>{order.fixDesc}</Text>
                        </View>
                      )}
                      {isRepairman && order.state === OrderState.assigned && (
                        <View
                          className={styles.itemInfo}
                          style='justify-content: flex-end'
                        >
                          <QQButton>去完成</QQButton>
                        </View>
                      )}
                      {/* {order.state === OrderState.finish &&
                        order.comment !== null && (
                          <View className={styles.itemInfo}>
                            <Text className={styles.label}>你的评价:</Text>
                            <Text className={styles.value}>
                              {order.comment}
                            </Text>
                          </View>
                        )} */}
                    </View>
                    {isNormalUser &&
                      order.comment === null &&
                      order.state === OrderState.finish && (
                        <View
                          className={classNames(
                            styles.itemInfo,
                            styles.comment,
                          )}
                        >
                          <View
                            onClick={async e => {
                              e.stopPropagation();
                              const isReload = await Router.toOrderComment<
                                boolean
                              >({
                                params: { id: order.id },
                              });
                              isReload && (await getOrderList());
                            }}
                            className={styles.commentButton}
                          >
                            去评价
                          </View>
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
export default Order;

definePageConfig({
  navigationBarTitleText: '',
  enablePullDownRefresh: true,
  backgroundTextStyle: 'dark',
});
