import { makeSuiClient } from "./dapp-kit";

export class SuiClient {
  constructor(_: any) {}
  getCoins = makeSuiClient().getCoins;
  getBalance = makeSuiClient().getBalance;
  getAllBalances = makeSuiClient().getAllBalances;
  multiGetObjects = makeSuiClient().multiGetObjects;
  getDynamicFieldObject = makeSuiClient().getDynamicFieldObject;
  waitForTransaction = makeSuiClient().waitForTransaction;
}
export function getFullnodeUrl(_: "devnet" | "testnet" | "mainnet") {
  return "http://mock-node";
}

