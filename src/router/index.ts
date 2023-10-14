import api from '@/api';
import { RouteWhitelist } from '@/constants';
import Taro from '@tarojs/taro';
import { registerMiddleware, Middleware } from 'tarojs-router-next';

const AuthMiddleWare: Middleware = async (ctx, next) => {
  const path = ctx.route.url.split('/')[2];

  // 目标路由不在白名单中
  if (!RouteWhitelist.includes(path)) {
    const token = Taro.getStorageSync('token') as string;
    // 没有登陆过
    if (!token) {
      Taro.showModal({
        title: '您还未登录，是否去登录?',
        confirmText: '去登录',
        async success(result) {
          if (result.confirm) {
            await api.login();
          }
        },
      });
    } else await next();
  } else await next();
};

registerMiddleware(AuthMiddleWare);
