/// <reference types="@tarojs/taro" />

declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';

declare namespace NodeJS {
  interface ProcessEnv {
    TARO_ENV:
      | 'weapp'
      | 'swan'
      | 'alipay'
      | 'h5'
      | 'rn'
      | 'tt'
      | 'quickapp'
      | 'qq'
      | 'jd';
  }
}

declare enum RoleEnum {
  admin = 0,
  user = 1,
  repairman = 2,
}

interface Res<T = any> {
  code: 200 | 201 | 400 | 401 | 403 | 404 | 500;
  message: string;
  data: T;
}

interface UserInfo extends Base {
  avatarUrl: string;
  openid: string;
  role: 0 | 1 | 2;
  name?: string;
  phone?: string;
  nickname?: string;
  userNo?: string;
  academyName?: string;
  majorName?: string;
  majorNo?: string;
  className?: string;
  classNo?: string;
}

type User = UserInfo;

interface LoginRes {
  token: string;
  userInfo: UserInfo;
}

type RegisterRes = LoginRes;

interface LoginData {
  code: string;
}

interface RegisterData {
  nickname?: string;
  avatarUrl?: string;
  userNo?: string;
}

interface AddressRes {
  id: number;
  name: string;
  level: number;
  parent: AddressRes | null;
  children: AddressRes[];
}
type AddressListRes = PaginationRes<AddressRes>;
type AddressAncestorsRes = AddressRes[];

type UploadRes = { url: string }[];

type ParamErrorRes = string[];

interface ReportData {
  name: string;
  phone: string;
  desc: string;
  addressId: number;
  expectTime: Date;
  urgentLevel?: number;
  faultImages: string[];
}

type TabIndex = 0 | 1;

interface StoreState {
  token?: string;
  userInfo?: Partial<UserInfo>;
  noticeList: Notice[];
  selectedTabIndex: TabIndex;
}

interface Base {
  id: number;
  createdTime: Date;
  updatedTime: Date;
}
interface Img extends Base {
  url: string;
  type: 0 | 1;
}

interface Order extends Base {
  name: string;
  phone: string;
  orderNo: string;
  desc: string;
  address: AddressAncestorsRes;
  urgentLevel: 0 | 1 | 2;
  state: OrderState;
  expectTime: Date;
  reason?: string | null;
  comment?: string | null;
  star?: number | null;
  faultImages?: Img[];
  finishImages?: Img[];
  repairman?: User | null;
  fixTime: Date;
  fixDesc: string | null;
  user: User;
}
interface Pagination {
  totalCount: number;
  totalPage: number;
  currentPage: number;
  pageSize: number;
}

interface PaginationRes<R> {
  list: R[];
  pagination: Pagination;
}

type OrderListRes = PaginationRes<Order>;
type OrderState = 0 | 1 | 2 | 3 | 4;
declare enum FeedbackState {
  pendding = 0,
  resolve = 1,
}
interface QueryParam {
  pageSize?: number;
  page?: number;
  orderState?: OrderState;
  name?: string;
  feedbackState?: FeedbackState;
}
type GetOrderListParam = Pick<
  QueryParam,
  'name' | 'orderState' | 'page' | 'pageSize'
>;

type GetFeedbackListParam = Pick<
  QueryParam,
  'feedbackState' | 'page' | 'pageSize'
>;

interface PostFeedbackData {
  name: string;
  phone: string;
  desc: string;
  images?: string[];
}

interface Feedback extends Omit<PostFeedbackData, 'images'>, Base {
  images?: Img[];
  state: 0 | 1;
  reply: string | null;
  user: User;
}

type FeedbackListRes = PaginationRes<Feedback>;

interface Notice extends Base {
  image: string;
  title: string;
  content: string;
  focus: boolean;
}

type GetNoticeListParam = Pick<QueryParam, 'page' | 'pageSize'>;
type NoticeListRes = PaginationRes<Notice>;

interface PatchUserInfoData {
  name?: string;
  nickname?: string;
  phone?: string;
  avatarUrl?: string;
}

interface Pane<T> {
  title: string;
  state?: number;
  list: T[];
  role?: RoleEnum[];
}
type OrderPane = Pane<Order>;
type FeedbackPane = Pane<Feedback>;

interface PostCommentData {
  comment: string;
  star: number;
}

interface PostFixData {
  fixDesc: string;
  finishImages: string[];
}
