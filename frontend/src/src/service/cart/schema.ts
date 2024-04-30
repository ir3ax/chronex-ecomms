export type FetchCartDetails = {
  products: CartProduct[];
};
  
export type CartProduct = {
  productId: string;
  productName: string;
  productImg: string;
  discount: string;
  discountedPrice: number;
  rating: number;
  productSold: number;
  productFreebies: string | null;
  quantity: number;
  currentQuantity: number;
  price: number;
  total: number;
};