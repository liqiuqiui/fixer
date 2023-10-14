import Taro from '@tarojs/taro';
import { FC } from 'react';
import QQButton from '../QQButton';

interface Props {
  phone: string;
}
const CallButton: FC<Props> = ({ phone }) => {
  return (
    <QQButton
      size='mini'
      onClick={e => {
        e.stopPropagation();
        Taro.showModal({
          title: '提示',
          content: '拨打 ' + phone,
          success(result) {
            if (result.confirm) {
              Taro.makePhoneCall({
                phoneNumber: phone,
              });
            }
          },
        });
      }}
      className='iconfont icon-call'
    >
      拨号
    </QQButton>
  );
};

export default CallButton;
