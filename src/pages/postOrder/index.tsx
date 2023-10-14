import api from '@/api';
import SubmitButton from '@/components/submitButton';
import toast from '@/components/toast';
import { BASE, RoleEnum } from '@/constants';
import { useAppSelector } from '@/store';
import { isVideoURL } from '@/utils';
import { Input, Radio, TextArea } from '@nutui/nutui-react-taro';
import { Picker, View, Text, Image, Video } from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import classNames from 'classnames';
import { FC, useState } from 'react';
import Router from 'tarojs-router-next';
import styles from './index.module.scss';

const PostOrder: FC = () => {
  const { userInfo, isNormalUser } = useAppSelector(state => ({
    userInfo: state.store.userInfo,
    isNormalUser: state.store.userInfo?.role === RoleEnum.user,
  }));
  const [reportState, setReportState] = useState<ReportData>({
    addressId: 0,
    desc: '',
    name: userInfo?.name ?? '',
    expectTime: new Date(),
    phone: userInfo?.phone ?? '',
    urgentLevel: 0,
    faultImages: [],
  });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const [multiArray, setMultiArray] = useState<
    Omit<AddressRes, 'children'>[][]
  >([]);

  const [multiIndex, setMultiIndex] = useState<number[]>([0, 0, 0]);

  const [addressList, setAddressList] = useState<AddressRes[]>([]);

  const [selectedAddress, setSelectedAddress] = useState('');

  useLoad(async () => {
    if (!isNormalUser) {
      await toast.fail('没有访问权限');
      Router.back();
      return;
    }
    api.getAddressList().then(res => {
      if (res.code === 200) {
        console.log(res.data);
        const list = res.data.list;
        setAddressList(list);
        const columnOne = list.filter(v => v.level === 1);
        const columnTwo = list.filter(v => v.parent?.id === columnOne[0].id);
        const columnThree = list.filter(v => v.parent?.id === columnTwo[0].id);

        setMultiArray([columnOne, columnTwo, columnThree]);
      }
    });
  });

  const handleUploadImage = async () => {
    const uploadRes = await api.uploadMedia({
      count: 9 - reportState.faultImages.length,
    });
    if (uploadRes.code === 201) {
      setReportState(pre => ({
        ...pre,
        faultImages: [
          ...pre.faultImages,
          ...uploadRes.data.map(v => BASE + v.url),
        ],
      }));
    } else {
      toast.fail('图片上传失败!');
    }
  };

  const handleSubmit = () => {
    reportState.expectTime = new Date(selectedDate + ' ' + selectedTime);
    const { name, phone, addressId, desc } = reportState;

    if (
      !name ||
      !phone ||
      !addressId ||
      !desc ||
      !selectedDate ||
      !selectedTime
    ) {
      toast.show('请将报修信息填写完整!');
      return;
    }
    api.postOrder(reportState).then(res => {
      if (res.code === 201) {
        toast.success('提交成功');
        setTimeout(() => {
          Router.back();
        }, 1500);
      }
      if (res.code === 400) {
        toast.show(res.data[0]);
      }
    });
  };
  return !isNormalUser ? (
    <></>
  ) : (
    <View className={styles.postOrder}>
      <Input
        label='姓名:'
        defaultValue={reportState?.name}
        placeholder='请输入姓名'
        change={val => {
          setReportState(pre => ({ ...pre, name: val }));
        }}
      />
      <Input
        type='tel'
        label='手机号码:'
        defaultValue={reportState.phone}
        placeholder='请输入手机号'
        change={val => {
          setReportState(pre => ({ ...pre, phone: val }));
        }}
      />
      <View className={styles.urgentLevel}>
        <View className={styles.label}>紧急等级:</View>
        <Radio.RadioGroup
          defaultValue={0}
          value={reportState.urgentLevel}
          onChange={(urgentLevel: number) => {
            setReportState(pre => ({ ...pre, urgentLevel }));
          }}
          direction='horizontal'
        >
          <Radio value={0} checked>
            一般
          </Radio>
          <Radio value={1}>严重</Radio>
          <Radio value={2}>紧急</Radio>
        </Radio.RadioGroup>
      </View>
      <Picker
        className={styles.picker}
        start={new Date().toLocaleDateString().replace(/\//g, '-')}
        mode='date'
        value={selectedDate}
        onChange={e => {
          setSelectedDate(e.detail.value);
        }}
      >
        <Input
          disabled
          label='预约日期:'
          defaultValue={selectedDate}
          placeholder='请选择维修日期'
        />
      </Picker>
      <Picker
        end='18:00'
        mode='time'
        value={selectedDate}
        onChange={e => {
          setSelectedTime(e.detail.value);
        }}
      >
        <Input
          disabled
          label='预约时间:'
          defaultValue={selectedTime}
          placeholder='请选择维修时间'
        />
      </Picker>
      <Picker
        mode='multiSelector'
        value={multiIndex}
        range={multiArray}
        rangeKey='name'
        onChange={async e => {
          const idxArr = e.detail.value;

          setMultiIndex(idxArr);

          const addressId = multiArray[2][idxArr[2]].id;
          const res = await api.getAddressAncestors(addressId);
          if (res.code === 200)
            setSelectedAddress(res.data.map(v => v.name).join(' '));

          setReportState(pre => ({
            ...pre,
            addressId,
          }));
        }}
        onColumnChange={e => {
          console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
          const columnIndex = e.detail.column;
          const columnIndexValue = e.detail.value;
          // 当columnIndex为2时，改变的时最后一列了，没有下一列了，直接return
          if (columnIndex === 2) return;
          setMultiIndex(pre => {
            const copy = [...pre];
            copy[columnIndex] = columnIndexValue;
            copy[columnIndex + 1] = 0;
            return copy;
          });
          setMultiArray(pre => {
            const copy = [...pre];
            // 改变的是columnIndex列，那么columnIndex列的下一列也要变化
            copy[columnIndex + 1] = addressList.filter(
              v => v.parent?.id === copy[columnIndex][columnIndexValue].id,
            );

            if (columnIndex === 0)
              copy[2] = addressList.filter(
                v => v.parent?.id === copy[1][0]?.id,
              );
            return copy;
          });
        }}
      >
        <Input
          disabled
          label='地址:'
          defaultValue={selectedAddress}
          placeholder='请选择地址'
        />
      </Picker>
      {/* 故障描述 */}
      <View className={styles.faultDesc}>
        <View>故障描述:</View>
        <TextArea
          className={styles.textArea}
          placeholder='请输入故障描述'
          onChange={value => {
            setReportState(pre => ({ ...pre, desc: value }));
          }}
        ></TextArea>
      </View>
      {/* 图片/视频上传 */}
      <View className={styles.imageUpload}>
        <View className={styles.label}>图片/视频:</View>
        <View className={styles.tip}>
          请确保图片/视频的清晰度({reportState.faultImages.length ?? 0}/9)
        </View>
        <View className={styles.imageList}>
          {reportState.faultImages.map(url => {
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
                        urls: reportState.faultImages,
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
                          setReportState(pre => ({
                            ...pre,
                            faultImages: pre.faultImages.filter(v => v !== url),
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
          {reportState.faultImages.length < 9 && (
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

export default PostOrder;

definePageConfig({
  navigationBarTitleText: '我要报修',
});
