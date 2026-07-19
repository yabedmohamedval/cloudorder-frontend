export interface Order {

  id: number;

  productName: string;

  quantity: number;

  price: number;

  createdAt: string;

}

export interface OrderRequest {
  productName: string;
  quantity: number;
  price: number;
}