import Taro from '@tarojs/taro';
type ToastOption = Partial<Taro.showToast.Option>;
class Toast {
  private defaultOption = {
    mask: true,
    duration: 1500,
  };
  private generate(
    msg: string,
    type?: 'success' | 'error' | 'loading' | 'none',
    options?: ToastOption,
  ) {
    return new Promise(resolve => {
      return Taro.showToast({
        title: msg,
        icon: type,
        ...this.defaultOption,
        ...options,
      }).then(() => {
        setTimeout(() => {
          resolve(true);
        }, this.defaultOption.duration);
      });
    });
  }
  loading(msg = '加载中', options?: Partial<Taro.showLoading.Option>) {
    const { duration, ...otherDefaultOptions } = this.defaultOption;
    return Taro.showLoading({ title: msg, ...otherDefaultOptions, ...options });
  }
  show(msg: string, options?: ToastOption) {
    return this.generate(msg, 'none', options);
  }
  success(msg: string, options?: ToastOption) {
    return this.generate(msg, 'success', options);
  }
  fail(msg: string, options?: ToastOption) {
    return this.generate(msg, 'error', options);
  }
  hide() {
    Taro.hideLoading();
    Taro.hideToast();
  }
}
export default new Toast();
