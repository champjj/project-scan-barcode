export interface IUser {
  username: string;
  password: string;
  shopname: string;
  mobileNumber: string;
  email: string;
  discountMember: number;
  imageShop: string;
}

export interface IMember {
  memberName: string;
  mobileNumber: string;
  lastorderTimestamp: number | string;
}
