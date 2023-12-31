export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/profile/index',
    'pages/postOrder/index',
    'pages/orderComment/index',
    'pages/order/index',
    'pages/feedbackHome/index',
    'pages/feedback/index',
    'pages/postFeedback/index',
    'pages/profileDetail/index',
    'pages/noticeDetail/index',
    'pages/orderDetail/index',
    'pages/fixHome/index',
    'pages/feedbackDetail/index',
    'pages/notice/index',
    'pages/register/index',
  ],
  tabBar: {
    // custom: true,
    list: [
      {
        pagePath: 'pages/home/index',
        iconPath: './assets/images/home.png',
        selectedIconPath: './assets/images/home-active.png',
        text: '首页',
      },
      // {
      //   pagePath: 'pages/fixOrder/index',
      //   iconPath: './assets/images/fix.png',
      //   selectedIconPath: './assets/images/fix-active.png',
      //   text: '维修单',
      // },
      {
        pagePath: 'pages/profile/index',
        iconPath: './assets/images/profile.png',
        selectedIconPath: './assets/images/profile-active.png',
        text: '个人中心',
      },
    ],
    color: '#8a8a8a',
    selectedColor: '#2878ff',
    borderStyle: 'white',
    backgroundColor: '#fff',
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  lazyCodeLoading: 'requiredComponents',
});
