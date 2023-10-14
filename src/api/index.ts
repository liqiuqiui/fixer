import toast from '@/components/toast';
import { BASE } from '@/constants';
import store from '@/store';
import { setLoginInfo } from '@/store/slices/storeSlice';
import Taro from '@tarojs/taro';
import Router from 'tarojs-router-next';
import request from './request';

export const login = async (isRefresh = false) => {
  try {
    let userProfile: Partial<Taro.getUserProfile.SuccessCallbackResult> = {};

    if (!isRefresh) {
      userProfile = await Taro.getUserProfile({
        desc: '用于完善用户信息',
      });
      console.log('非刷新,获取用户信息', userProfile);
    }

    const { code } = await Taro.login();

    const res = await request.post<LoginData, LoginRes>('/user/login', {
      code,
    });

    if (res.code === 200) {
      store.dispatch(setLoginInfo(res.data));
      if (!isRefresh) toast.success('登陆成功');
      return res.data;
    }

    if (res.code === 400 && !isRefresh) toast.fail(res.message);
  } catch (err) {
    if (!isRefresh) toast.fail('登陆取消');
    console.log('err', err);
  }
};

export const register = async (registerData: Omit<RegisterData, 'code'>) => {
  const { code } = await Taro.login();

  const res = await request.post<LoginData, LoginRes>('/user/register', {
    code,
    ...registerData,
  });

  if (res.code === 200) {
    store.dispatch(setLoginInfo(res.data));
    await toast.success('注册成功');
    Router.toProfile();
    return res.data;
  }
  if (res.code === 400) {
    toast.fail((res.data as unknown) as string);
  }
};

export const getOrderList = (params: GetOrderListParam) => {
  return request.get<OrderListRes, GetOrderListParam>('/order', params);
};
export const getOrderById = (orderId: number) => {
  return request.get<Order, { orderId: number }>(`/order/${orderId}`);
};

export const getAddressList = () => {
  return request.get<AddressListRes, { pageSize: number }>('/address', {
    pageSize: 999,
  });
};

export const getAddressAncestors = (addressId: number) =>
  request.get<AddressAncestorsRes>(`/address/ancestors/${addressId}`);

export const postOrder = (reportState: ReportData) => {
  return request.post<ReportData, ParamErrorRes>('/order', reportState);
};

export const postFeedback = (postFeedbackData: PostFeedbackData) => {
  return request.post<PostFeedbackData, ParamErrorRes>(
    '/feedback',
    postFeedbackData,
  );
};

export const getFeedbackList = (params: GetFeedbackListParam) => {
  return request.get<FeedbackListRes, GetOrderListParam>('/feedback', params);
};

export const getNoticeList = (params: GetNoticeListParam) => {
  return request.get<NoticeListRes, GetNoticeListParam>('/notice', params);
};

export const patchUserInfo = (patchUserInfoData: PatchUserInfoData) => {
  return request.put<PatchUserInfoData, UserInfo>('/user', patchUserInfoData);
};

export const uploadMedia = (
  option?: Omit<Taro.chooseMedia.Option, 'success' | 'fail'>,
) =>
  new Promise<Res<UploadRes>>((resolve, reject) => {
    Taro.chooseMedia({
      count: 22,
      sourceType: ['album', 'camera'],
      async success(result) {
        console.log('选择结果', result);

        const allRes = await Promise.all(
          result.tempFiles.map(file =>
            Taro.uploadFile({
              url: BASE + '/api/v1/upload',
              name: 'images',
              filePath: file.tempFilePath,
            }),
          ),
        ).then(resArr => resArr.map<Res<UploadRes>>(v => JSON.parse(v.data)));

        resolve({
          code: allRes[0].code,
          data: allRes.map(v => v.data[0]),
          message: allRes[0].message,
        });
      },
      fail(res) {
        reject(res);
      },
      ...option,
    });
  });

export const postComment = (
  orderId: number,
  postCommentData: PostCommentData,
) => {
  return request.post<PostCommentData>(
    `/order/comment/${orderId}`,
    postCommentData,
  );
};

export const postFix = (orderId: number, postFixData: PostFixData) => {
  return request.put(`/order/finish/${orderId}`, postFixData);
};

export const matchUser = (userNo: string) =>
  request.get<UserInfo>(`/user/match/${userNo}`);

export default {
  login,
  register,
  getAddressList,
  getAddressAncestors,
  postOrder,
  getOrderList,
  getOrderById,
  postFeedback,
  getFeedbackList,
  getNoticeList,
  patchUserInfo,
  uploadMedia,
  postComment,
  postFix,
  matchUser,
};
