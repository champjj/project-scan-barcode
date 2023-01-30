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
  qty: string;
  price: number;
  category: string;
  timeStamp: string;
  memberName: string;
  memberMobile: string;
}
