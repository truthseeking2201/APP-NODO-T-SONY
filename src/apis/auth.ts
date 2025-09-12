import axios from "axios";
import { IS_MOCK } from "@/config/mock";
const baseURL = IS_MOCK ? "" : (import.meta.env.VITE_NODO_APP_URL ?? "");

const URLS = {
  login: "/data-management/auth/login",
  refreshToken: "/data-management/auth/refresh",
};

export const loginWallet = async (payload: {
  signature: string;
  timestamp: number;
  address: string;
}) => {
  const res = await axios.post(`${baseURL}${URLS.login}`, payload, {
    timeout: 10000,
  });
  return res.data?.data;
};
