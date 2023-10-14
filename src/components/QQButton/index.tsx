import { ITouchEvent, View } from '@tarojs/components';
import classNames from 'classnames';
import { FC, PropsWithChildren } from 'react';

import styles from './index.module.scss';

interface Props {
  size?: 'mini' | 'default' | 'large';
  hollow?: boolean;
  border?: boolean;
  onClick?: (event: ITouchEvent) => void;
  className?: string;
}

const sizeClassMap = {
  mini: styles.mini,
  default: styles.default,
  large: styles.large,
};

const QQButton: FC<PropsWithChildren & Props> = ({
  children,
  size = 'default',
  onClick = () => {},
  className = '',
  hollow = false,
  border = true,
}) => {
  return (
    <View
      className={classNames(styles.QQButton, sizeClassMap[size], className, {
        [styles.hollow]: hollow,
        [styles.border]: hollow && border,
      })}
      onClick={onClick}
    >
      {children ?? '按钮'}
    </View>
  );
};

export default QQButton;
