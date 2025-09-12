export const bcs = {
  // simple passthrough helpers if something calls them
  tuple: (_schema: any[]) => ({ serialize: (_v: any) => ({ toBytes: () => new Uint8Array() }) }),
  u64: () => ({}),
  ser: () => ({ toBytes: () => new Uint8Array() }),
};

