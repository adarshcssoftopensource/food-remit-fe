export interface OrderData {
  id: string;
  userId?: string;
  recieverId?: string;
  storeId?: string;
  orderType?: number;
  orderStatus: number;
  addedOn?: string;
  addedOnTimestamp?: string;
  createdAt: string;
  updatedAt: string;
  items?: Record<string, unknown>[];
  transactions?: Record<string, unknown>[];
  userName?: string;
  recieverName?: string;
  storeName?: string;
  price?: string;
}
