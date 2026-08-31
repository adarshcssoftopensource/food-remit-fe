import { ItemData as Item } from "../../catalogue-management/items/types/item.types";

export interface ProductBox {
  id: string;
  title: string;
  image?: string;
  price: number;
  status: boolean;
  countryId: string;
  createdById?: string;
  addedOn?: string;
  addedOnTimestamp?: string;
  createdAt: string;
  updatedAt: string;
  items?: ProductBoxItem[];
}

export interface ProductBoxItem {
  id: string;
  boxId: string;
  itemId: string;
  createdAt: string;
  updatedAt: string;
  item?: Item;
}

export interface UseGetProductBoxesArgs {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface GetProductBoxesResponse {
  data: ProductBox[];
  total: number;
  page: number;
  lastPage: number;
}
