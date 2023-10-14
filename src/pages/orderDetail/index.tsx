import api from '@/api';
import { View, Text, Image, Video } from '@tarojs/components';
import { useRouter } from '@tarojs/taro';
import { FC, useEffect, useState } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';
import Taro from '@tarojs/taro';
import { formatTime, isVideoURL } from '@/utils';
import SubmitButton from '@/components/submitButton';
import { BASE, OrderState } from '@/constants';
import { Router } from 'tarojs-router-next';
import { useAppSelector } from '@/store';
import { RoleEnum } from '@/constants';
import CallButton from '@/components/callButton';
import { TextArea } from '@nutui/nutui-react-taro';
import toast from '@/components/toast';

const orderStateMap = [
  { title: '待审核', desc: '维修单已提交, 请等待管理员审核' },
  { title: '审核通过', desc: '维修单已通过审核, 等待派单' },
  { title: '被驳回', desc: '维修单未通过审核, 请查看原因' },
  { title: '已派单', desc: '维修单已派单, 请等待维修' },
  { title: '已完成', desc: '维修单已完成' },
];

const OrderDetail: FC = () => {
  const { isRepairman, isNormalUser } = useAppSelector(
    ({ store: { userInfo } }) => ({
      isRepairman: userInfo?.role === RoleEnum.repairman,
      isNormalUser: userInfo?.role === RoleEnum.user,
    }),
  );
  const route = useRouter();
  const [order, setOrder] = useState<Order>();

  const [postFixData, setPostFixData] = useState<PostFixData>({
    fixDesc: '',
    finishImages: [],
  });

  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: isRepairman ? '维修单详情' : '报修详情',
    });
  }, [isRepairman]);

  const getOrder = async () => {
    await api.getOrderById(+route?.params?.id!).then(res => {
      if (res.code === 200) setOrder(res.data);
    });
  };
  useEffect(() => {
    getOrder();
  }, []);

  const handleUploadImage = async () => {
    const uploadRes = await api.uploadMedia({
      count: 9 - postFixData.finishImages.length,
    });
    if (uploadRes.code === 201) {
      setPostFixData(pre => ({
        ...pre,
        finishImages: [
          ...pre.finishImages,
          ...uploadRes.data.map(v => BASE + v.url),
        ],
      }));
    } else {
      toast.fail('图片上传失败!');
    }
  };

  const handleSubmit = () => {
    if (postFixData.fixDesc.length < 2) {
      toast.show('维修结果不得少于2个字符', { duration: 800 });
      return;
    }
    // if (postFixData.finishImages.length < 1) {
    //   toast.show('至少上传一张图片', { duration: 800 });
    //   return;
    // }
    api.postFix(order?.id!, postFixData).then(async res => {
      if (res.code === 200) {
        await toast.success('提交成功');
        getOrder();
      }
    });
  };

  return (
    <View className={styles.orderDetail}>
      {isNormalUser && (
        <View className={styles.orderState}>
          <Text className={styles.title}>
            {orderStateMap[order?.state!]?.title}
          </Text>
          <Text className={styles.desc}>
            {orderStateMap[order?.state!]?.desc}
            {!order?.comment &&
              order?.state === OrderState.finish &&
              ', 请及时做出评价'}
          </Text>
        </View>
      )}
      {order?.state === OrderState.fail && (
        <View className={styles.card}>
          <View className={styles.cardHead}>订单被驳回</View>
          <View className={styles.row}>
            <Text className={styles.label}>驳回原因:</Text>
            <Text className={styles.value}>{order.reason}</Text>
          </View>
        </View>
      )}
      <View className={styles.card}>
        <View className={styles.cardHead}>报修信息</View>
        <View className={styles.row}>
          <Text className={styles.label}>维修单号:</Text>
          <Text className={styles.value}>{order?.orderNo.split('-')[0]}</Text>
        </View>
        <View className={styles.row}>
          <Text className={styles.label}>报修人:</Text>
          <Text className={styles.value}>
            {order?.name ?? order?.user.name}
          </Text>
        </View>
        <View className={styles.row}>
          <Text className={styles.label}>手机号:</Text>
          <View
            className={styles.value}
            style='display: flex; align-items: center; column-gap: 6rpx'
          >
            <Text>{order?.phone ?? order?.user.phone}</Text>
            {order?.state === OrderState.assigned && isRepairman && (
              <CallButton phone={order?.phone ?? order?.user.phone!} />
            )}
          </View>
        </View>
        <View className={styles.row}>
          <Text className={styles.label}>报修时间:</Text>
          <Text className={styles.value}>{formatTime(order?.createdTime)}</Text>
        </View>
        <View className={styles.row}>
          <Text className={styles.label}>预约时间:</Text>
          <Text className={styles.value}>{formatTime(order?.expectTime)}</Text>
        </View>
        <View className={styles.row}>
          <Text className={styles.label}>报修地址:</Text>
          <Text className={styles.value}>
            {order?.address.map(v => v.name).join(' ')}
          </Text>
        </View>
      </View>
      {isNormalUser && order?.state! >= OrderState.assigned && (
        <View className={styles.card}>
          <View className={styles.cardHead}>维修工信息</View>
          <View className={styles.row}>
            <Text className={styles.label}>姓名:</Text>
            <Text className={styles.value}>{order?.repairman?.name}</Text>
          </View>
          <View className={styles.row} style='align-items: center'>
            <Text className={styles.label}>手机号:</Text>
            <View className={classNames(styles.value, styles.phone)}>
              <Text>{order?.repairman?.phone}</Text>
              {<CallButton phone={order?.repairman?.phone!} />}
            </View>
          </View>
        </View>
      )}
      <View className={styles.card}>
        <View className={styles.cardHead}>故障信息</View>
        <View className={styles.row}>
          <Text className={styles.label}>故障描述:</Text>
          <Text className={styles.value}>{order?.desc}</Text>
        </View>
        {order?.faultImages?.length! > 0 && (
          <View className={classNames(styles.row, styles.imageRow)}>
            <Text className={styles.label}>图片/视频:</Text>
            <View className={styles.imageList}>
              {order?.faultImages?.map(img => {
                return (
                  <View className={styles.imageItem}>
                    {isVideoURL(img.url) ? (
                      <Video
                        className={styles.video}
                        showMuteBtn
                        controls
                        src={img.url}
                        muted
                      />
                    ) : (
                      <Image
                        src={img.url}
                        mode='aspectFill'
                        onClick={() => {
                          Taro.previewImage({
                            current: img.url,
                            urls: order?.faultImages?.map(v => v.url)!,
                          });
                        }}
                      />
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </View>

      {order?.state === OrderState.finish && (
        <View className={styles.card}>
          <View className={styles.cardHead}>维修信息</View>
          <View className={styles.row}>
            <Text className={styles.label}>维修时间:</Text>
            <Text className={styles.value}>{formatTime(order?.fixTime)}</Text>
          </View>
          <View className={styles.row}>
            <Text className={styles.label}>维修结果:</Text>
            <Text className={styles.value}>{order.fixDesc}</Text>
          </View>
          {order?.finishImages?.length! > 0 && (
            <View className={classNames(styles.row, styles.imageRow)}>
              <Text className={styles.label}>完工照片:</Text>
              <View className={styles.imageList}>
                {order?.finishImages?.map(img => {
                  return (
                    <View className={styles.imageItem}>
                      <Image
                        src={img.url}
                        mode='aspectFill'
                        onClick={() => {
                          Taro.previewImage({
                            current: img.url,
                            urls: order?.faultImages?.map(v => v.url)!,
                          });
                        }}
                      />
                    </View>
                  );
                })}
              </View>
            </View>
          )}
          {order?.state === OrderState.finish && order.comment !== null && (
            <View className={styles.row}>
              <Text className={styles.label}>
                {isNormalUser ? '你的' : '维修'}评价:
              </Text>
              <View className={styles.value} style='flex: 1'>
                <Text style='word-break: break-all'>{order?.comment}</Text>
                <View className={styles.star}>
                  {new Array(5).fill(0).map((_v, idx) => {
                    return (
                      <Text
                        className={classNames(
                          'iconfont',
                          idx < order.star! ? 'icon-star-fill' : 'icon-star',
                        )}
                      ></Text>
                    );
                  })}
                </View>
              </View>
            </View>
          )}
        </View>
      )}

      {isRepairman && order?.state === OrderState.assigned && (
        <>
          <View className={styles.card}>
            <View className={styles.cardHead}>维修反馈:</View>
            <View className={styles.row}>
              <View className={styles.label}>维修结果:</View>
              <TextArea
                limitshow
                className={styles.textArea}
                placeholder='请填写您维修结果'
                maxlength={120}
                onChange={fixDesc => {
                  setPostFixData(pre => ({ ...pre, fixDesc }));
                }}
              ></TextArea>
            </View>
            {
              <View className={classNames(styles.row, styles.imageRow)}>
                <View
                  className={styles.label}
                  style='display:flex;flex-direction:column;'
                >
                  <Text>图片/视频:</Text>
                  <Text className={styles.tip}>
                    请确保图片/视频的清晰度(
                    {postFixData.finishImages.length ?? 0}
                    /9)
                  </Text>
                </View>

                <View className={styles.imageList}>
                  {postFixData.finishImages?.map(url => {
                    return (
                      <View className={styles.imageItem}>
                        {isVideoURL(url) ? (
                          <Video
                            className={styles.video}
                            showMuteBtn
                            controls
                            src={url}
                            muted
                          />
                        ) : (
                          <Image
                            src={url}
                            mode='aspectFill'
                            onClick={() => {
                              Taro.previewImage({
                                current: url,
                                urls: order?.faultImages?.map(v => v.url)!,
                              });
                            }}
                          />
                        )}
                        <View
                          className={styles.remove}
                          onClick={() => {
                            Taro.showModal({
                              title: '提示',
                              content: `是否要删除该${
                                isVideoURL(url) ? '视频' : '图片'
                              }?`,
                              showCancel: true,
                              success(res) {
                                if (res.confirm)
                                  setPostFixData(pre => ({
                                    ...pre,
                                    faultImages: pre.finishImages.filter(
                                      v => v !== url,
                                    ),
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
                  {postFixData.finishImages.length < 9 && (
                    <View
                      className={classNames(styles.choose, styles.imageItem)}
                      onClick={handleUploadImage}
                    >
                      <Text className='iconfont icon-upload'></Text>
                    </View>
                  )}
                </View>
              </View>
            }
          </View>
        </>
      )}
      {isRepairman && order?.state === OrderState.assigned && (
        <SubmitButton onClick={handleSubmit} />
      )}
      {order?.state === OrderState.finish &&
        order.comment === null &&
        isNormalUser && (
          <SubmitButton
            onClick={async () => {
              const isReload = await Router.toOrderComment<boolean>({
                params: { id: route.params.id },
              });
              isReload && getOrder();
            }}
          >
            去评价
          </SubmitButton>
        )}
    </View>
  );
};

export default OrderDetail;

definePageConfig({
  navigationBarTitleText: '',
});
