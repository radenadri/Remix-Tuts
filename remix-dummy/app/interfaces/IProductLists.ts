import type { IProduct } from "./IProduct";

export interface IProductLists {
  products: IProduct[];
  total: number;
  skip: number;
  limit: number;
}