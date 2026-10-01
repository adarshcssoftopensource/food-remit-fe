export type ManagerFormBaseValues = {
  image?: File[];
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  address1: string;
  address2?: string;
  residentialCountry: string;
  state: string;
  city: string;
  zipcode?: string;
};

export const MANAGER_INPUT_CLASS =
  "h-11 rounded-xl border-slate-200 bg-slate-50/80 transition focus-visible:bg-white";
