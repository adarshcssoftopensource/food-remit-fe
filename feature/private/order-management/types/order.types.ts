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
  items?: any[];
  transactions?: any[];
  userName?: string;
  recieverName?: string;
  storeName?: string;
}
