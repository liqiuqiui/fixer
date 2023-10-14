import { Button, View } from '@tarojs/components';
import classNames from 'classnames';
import { FC, PropsWithChildren } from 'react';
import styles from './index.module.scss';
interface Props {
  onClick?: () => void;
  className?: string;
  style?: string;
}
const SubmitButton: FC<Props & PropsWithChildren> = ({
  onClick = () => {},
  className,
  style,
  children,
}) => {
  return (
    <>
      <View
        style={style}
        className={classNames(styles.occupySubmit, className)}
      ></View>
      <Button
        style={style}
        type='primary'
        className={classNames(styles.submit, className)}
        onClick={onClick}
      >
        {children ?? '提交'}
      </Button>
    </>
  );
};

export default SubmitButton;
