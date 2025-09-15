export const PERIOD_TABS = [
  { value: "ONE_DAY", label: "1D" },
  { value: "ONE_WEEK", label: "1W" },
];

export const PERIOD_TABS_1W = [{ value: "ONE_WEEK", label: "1W" }];

export const ANALYTICS_TABS = [
  { value: "POSITION_PRICE", label: "Position Price" },
  // { value: "APY_YIELDS", label: "APY & Yields" },
];

export const ACTIVITIES_TABS = [
  { value: "ALL", label: "All" },
  { value: "SWAP", label: "Swap" },
  { value: "ADD_LIQUIDITY", label: "Add" },
  { value: "REMOVE_LIQUIDITY", label: "Remove" },
  { value: "LOOPING", label: "Looping" },
];

export const METHOD_DEPOSIT = {
  SINGLE: "SINGLE",
  DUAL: "DUAL",
};
export const METHOD_DEPOSIT_TABS = [
  { value: METHOD_DEPOSIT.DUAL, label: "Dual" },
  { value: METHOD_DEPOSIT.SINGLE, label: "Single" },
];

export const ITEMS_PER_PAGE = 50;
export const ADD_LIQUIDITY_TYPES = [
  "ADD_LIQUIDITY",
  "OPEN",
  "ADD_PROFIT_UPDATE_RATE",
  "CLAIM_REWARDS",
];
export const REMOVE_LIQUIDITY_TYPES = ["REMOVE_LIQUIDITY", "CLOSE"];
export const SWAP_TYPES = ["SWAP"];
export const LOOPING_TYPES = ["SUPPLY", "BORROW", "REPAY", "UNWIND"];

// Mock datasets for UserPosition (Profit Zone) chart
export const mockDataLiveChart = [
  { time: "00:00", percentage: -8.2, price: -8.2 },
  { time: "03:00", percentage: -4.1, price: -4.1 },
  { time: "06:00", percentage: 0.0, price: 0.0 },
  { time: "09:00", percentage: 3.2, price: 3.2 },
  { time: "12:00", percentage: 5.4, price: 5.4 },
  { time: "15:00", percentage: 7.8, price: 7.8 },
  { time: "18:00", percentage: 4.2, price: 4.2 },
  { time: "21:00", percentage: 2.1, price: 2.1 },
  { time: "24:00", percentage: 6.0, price: 6.0 },
];

export const mockDataLiveChart2 = [
  { time: "Mon", percentage: -10, price: -10 },
  { time: "Tue", percentage: -3, price: -3 },
  { time: "Wed", percentage: 2, price: 2 },
  { time: "Thu", percentage: 6, price: 6 },
  { time: "Fri", percentage: 9, price: 9 },
  { time: "Sat", percentage: 3, price: 3 },
  { time: "Sun", percentage: 5, price: 5 },
];
