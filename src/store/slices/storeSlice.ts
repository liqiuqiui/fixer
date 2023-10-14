import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Taro from '@tarojs/taro';

const initialState: StoreState = {
  token: '',
  userInfo: {},
  noticeList: [],
  selectedTabIndex: 0,
};

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    setLoginInfo(
      state,
      {
        payload: { token = '', userInfo = {} },
      }: PayloadAction<Pick<StoreState, 'token' | 'userInfo'>>,
    ) {
      if (token) {
        console.log('缓存新的token', token);
        Taro.setStorageSync('token', token);
        state.token = token;
      }
      if (userInfo) {
        console.log('缓存新的userInfo', userInfo);

        Taro.setStorageSync('userInfo', userInfo);
        state.userInfo = userInfo;
      }
    },
    initLoginInfo(state) {
      const token = Taro.getStorageSync('token') as string;
      const userInfo = Taro.getStorageSync('userInfo') as UserInfo;
      state.token = token;
      state.userInfo = userInfo;
    },
    clearLoginInfo(state) {
      state.token = '';
      state.userInfo = {};
      Taro.clearStorageSync();
    },
    setNoticeList(state, { payload }: PayloadAction<Notice[]>) {
      state.noticeList = payload;
    },
    setSelectedTabIndex(state, { payload }: PayloadAction<TabIndex>) {
      state.selectedTabIndex = payload;
    },
  },
});

export const {
  setLoginInfo,
  initLoginInfo,
  clearLoginInfo,
  setNoticeList,
  setSelectedTabIndex,
} = storeSlice.actions;

export default storeSlice.reducer;
