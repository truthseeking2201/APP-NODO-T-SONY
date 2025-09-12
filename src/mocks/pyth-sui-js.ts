export class SuiPriceServiceConnection {
  constructor(_: string, __?: any) {}
  async getPriceFeedsUpdateData(_: string[]) {
    return new Uint8Array();
  }
}
export class SuiPythClient {
  constructor(_suiClient: any, _pythStateId: string, _wormholeStateId: string) {}
  async updatePriceFeeds(_tx: any, _priceUpdateData: any, _ids: string[]) {
    return [];
  }
}

