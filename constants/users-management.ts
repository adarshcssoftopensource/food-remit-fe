export type UserData = {
  id: string;
  userName: string;
  userType: string;
  email: string;
  contactNumber: string;
  registeredOn: string;
  country: string;
  state: string;
  city: string;
  status: "Active" | "Inactive";
};

export const MOCK_USERS_DATA: UserData[] = [
  {
    id: "1",
    userName: "testuserxos",
    userType: "Normal",
    email: "foodremitxos@yopmail.com",
    contactNumber: "814660065",
    registeredOn: "2026-07-17 09:56:55",
    country: "India",
    state: "Punjab",
    city: "Sahibzada Ajit Singh Nagar",
    status: "Active",
  },
  {
    id: "2",
    userName: "userxo",
    userType: "Normal",
    email: "foodremitxo@yopmail.com",
    contactNumber: "827993817",
    registeredOn: "2026-07-17 09:53:38",
    country: "India",
    state: "Punjab",
    city: "Sahibzada Ajit Singh Nagar",
    status: "Active",
  },
  {
    id: "3",
    userName: "shivKumar",
    userType: "Normal",
    email: "shiv@yopmail.com",
    contactNumber: "8427961133",
    registeredOn: "2026-07-24 05:51:37",
    country: "India",
    state: "Punjab",
    city: "Sahibzada Ajit Singh Nagar",
    status: "Active",
  },
  {
    id: "4",
    userName: "vansharora",
    userType: "Normal",
    email: "vansh@yopmail.com",
    contactNumber: "6239666975",
    registeredOn: "2026-07-17 09:47:28",
    country: "India",
    state: "Punjab",
    city: "Sahibzada Ajit Singh Nagar",
    status: "Active",
  },
  {
    id: "5",
    userName: "kavin",
    userType: "Normal",
    email: "kevin@yopmail.com",
    contactNumber: "9592701163",
    registeredOn: "2026-07-14 01:07:04",
    country: "India",
    state: "Punjab",
    city: "Sahibzada Ajit Singh Nagar",
    status: "Active",
  },
  {
    id: "6",
    userName: "yadavsachin",
    userType: "Normal",
    email: "sachin@mailinator.com",
    contactNumber: "7087920183",
    registeredOn: "2026-07-03 07:20:40",
    country: "India",
    state: "Punjab",
    city: "Sahibzada Ajit Singh Nagar",
    status: "Active",
  },
  {
    id: "7",
    userName: "alvin",
    userType: "Normal",
    email: "alvin@yopmail.com",
    contactNumber: "9592701164",
    registeredOn: "2026-07-22 00:21:16",
    country: "India",
    state: "Punjab",
    city: "Sahibzada Ajit Singh Nagar",
    status: "Active",
  },
  {
    id: "8",
    userName: "Rohitdad",
    userType: "Normal",
    email: "rohit@yopmail.com",
    contactNumber: "9779318152",
    registeredOn: "2026-05-06 02:04:13",
    country: "India",
    state: "Punjab",
    city: "Sahibzada Ajit Singh Nagar",
    status: "Active",
  },
  {
    id: "9",
    userName: "testusergf",
    userType: "Normal",
    email: "testusergf@yopmail.com",
    contactNumber: "7896616238",
    registeredOn: "2026-05-05 10:44:13",
    country: "India",
    state: "Punjab",
    city: "Sahibzada Ajit Singh Nagar",
    status: "Active",
  },
  {
    id: "10",
    userName: "Jennacee",
    userType: "Normal",
    email: "jenna@yopmail.com",
    contactNumber: "9989819087",
    registeredOn: "2026-07-17 10:08:02",
    country: "Philippines",
    state: "Calabarzon",
    city: "General Trias",
    status: "Active",
  },
];

export const USER_MANAGEMENT_SELECT_DATA = [
  { label: "All Users", value: "All Users" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];
