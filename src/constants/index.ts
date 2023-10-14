export const BASE = 'http://192.168.101.5:3000';
export const Role = ['管理员', '普通用户', '维修工'];
export const defaultAvatar =
  'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132';

export const logo =
  'https://img2.baidu.com/it/u=2548023624,3776834739&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500';

export const RouteWhitelist = [
  'home',
  'profile',
  'notice',
  'noticeDetail',
  'register',
];

export enum RoleEnum {
  admin = 0,
  user = 1,
  repairman = 2,
}
export const enum OrderState {
  init = 0,
  pass = 1,
  fail = 2,
  assigned = 3,
  finish = 4,
}

export const enum FeedbackState {
  pending = 0,
  resolve = 1,
}
