export const endpoints: string[] = [
  'login',
  'logout',
  'register',
  'account',
  'chat',
  'products',
  'orders',
  'posts',
  'admin',
]

export enum SHIPPING_STATUS {
  Pending = 'pending',
  Delivered = 'delivered',
  Received = 'received',
}

export const CANCEL_ORDER_STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed',
}
