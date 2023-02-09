export interface IProduct {
  productName: string;
  productCode: string;
  imageProduct: string;
  qty: number;
  price: number;
  category: string;
}

export interface IHistorySelling {
  productName: string;
  qty: number;
  price: number;
  category: string;
  timeStamp: number;
  memberName: string;
  memberMobile: string;
}
