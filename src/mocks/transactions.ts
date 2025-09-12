// Extremely small shim that satisfies calls like new Transaction(), tx.splitCoins(), tx.moveCall(), etc.
export class Transaction {
  gas: any;
  constructor(_: any = {}) {
    this.gas = { id: "0xGAS" } as any;
    const basePure: any = ((typeOrVal: any, val?: any) => (val ?? typeOrVal));
    basePure.u64 = (v: any) => v;
    basePure.u128 = (v: any) => v;
    basePure.u32 = (v: any) => v;
    basePure.bool = (v: any) => v;
    basePure.vector = (_t: any, v: any) => v;
    basePure.address = (a: string) => a;
    this.pure = basePure;
  }
  pure: any;
  splitCoins(_from: any, amounts: any[]) { return amounts.map((_a) => ({ id: "0xSPLIT" } as any)); }
  mergeCoins(_primary: any, _coins: any[]) { return {}; }
  moveCall(_opts: any) { return {}; }
  transferObjects(_objs: any[], _addr: any) { return {}; }
  object(id: string) { return { objectId: id } as any; }
  serialize() { return new Uint8Array(); }
}

