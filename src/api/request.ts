import toast from '@/components/toast';
import { BASE } from '@/constants';
import store from '@/store';
import { clearLoginInfo } from '@/store/slices/storeSlice';
import Taro from '@tarojs/taro';
import axios, { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from 'axios';
import { TaroAdapter } from 'axios-taro-adapter';
import Router from 'tarojs-router-next';
import api from '.';

const taroAdapter: AxiosAdapter = config => {
  return new Promise((resolve, reject) => {
    let query = '';
    const params: Record<string, any> = config.params ?? {};
    const paramsArr: string[] = [];
    for (const k in params) {
      if (params[k] instanceof Array) {
        params[k].forEach(item => {
          paramsArr.push(k + '=' + JSON.stringify(item));
        });
      } else {
        if (params[k] !== undefined && params[k] !== null) {
          paramsArr.push(k + '=' + JSON.stringify(params[k]));
        }
      }
      if (paramsArr.length > 0) {
        query = '?' + paramsArr.join('&');
      }
    }

    Taro.request;

    Taro.request({
      ...config,
      url: (config.baseURL ?? '') + config.url + query,
      data: config.data,
      method: config.method,
      header: config.headers,
      timeout: config.timeout,
      success(res) {
        var response = {
          ...res,
          status: res.statusCode,
          statusText: res.errMsg,
          headers: res.header,
          config: config,
          request: null,
        };
        resolve(response);
        // settle(resolve, reject, response);
      },
      fail(res) {
        var response = {
          ...res,
          statusText: res.errMsg,
          config: config,
          request: null,
        };
        reject(response);
        // settle(resolve, reject, response, true);
      },
    });
  });
};

const instance = axios.create({
  baseURL: BASE + '/api/v1',
  timeout: 5000,
  adapter: taroAdapter,
});

instance.interceptors.request.use(async (config: AxiosRequestConfig) => {
  toast.loading();
  console.log('显示loading');

  let token = Taro.getStorageSync('token') as string;

  config.headers!['Authorization'] = 'Bearer ' + token;
  return config;
});
let requestSuccess = false;

instance.interceptors.response.use(
  async (response: AxiosResponse<Res>) => {
    switch (response.data.code) {
      case 200:
      case 201:
        requestSuccess = true;
        break;
      case 400:
        {
          if (typeof response.data.data === 'string')
            toast.show(response.data.data);
          else if (response.data.data instanceof Array)
            toast.show(response.data.data[0]);
          else toast.fail(response.data.message);
        }
        break;
      case 401:
        requestSuccess = true;
        store.dispatch(clearLoginInfo());
        {
          Taro.showModal({
            title: '提示',
            content: '登陆已过期',
            confirmText: '重新登陆',
            success(result) {
              if (result.confirm) {
                api.login(true);
                Router.back();
              }
            },
          });
        }
        break;
      case 403:
        await toast.fail('无权限访问!');
        Router.back();
        break;
      case 404:
        {
          toast.fail(response.data.data);
        }
        break;
      case 500:
        {
          toast.fail('服务器异常!');
        }
        break;
      default:
        break;
    }
    if (requestSuccess) {
      console.log('关闭loading');

      toast.hide();
      requestSuccess = false;
    }
    return response.data;
  },
  err => {
    toast.fail('请求超时!');
    console.log('err', err);
  },
);

const request = {
  post<D = any, R = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<Res<R>> {
    return (instance.post<Res<R>, AxiosResponse<Res<R>>, D>(
      url,
      data,
      config,
    ) as unknown) as Promise<Res<R>>;
  },
  put<D = any, R = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<Res<R>> {
    return (instance.put<Res<R>, AxiosResponse<Res<R>>, D>(
      url,
      data,
      config,
    ) as unknown) as Promise<Res<R>>;
  },
  get<R, P = any>(url: string, params?: P, config?: AxiosRequestConfig) {
    return (instance.get<Res<R>>(url, {
      ...config,
      params,
    }) as unknown) as Promise<Res<R>>;
  },
};

export default request;
