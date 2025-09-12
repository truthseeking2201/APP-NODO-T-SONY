import React from "react";
import { ONE_MILLION, makeCoinBalances } from "./fixtures/coins";

/** Providers just pass-through in mock mode */
export const WalletProvider: React.FC<React.PropsWithChildren<any>> = ({ children }) => <>{children}</>;
export const SuiClientProvider: React.FC<React.PropsWithChildren<{ networks?: any; defaultNetwork?: any }>> = ({ children }) => <>{children}</>;

/** Network config (unused by mocks) */
export const createNetworkConfig = (_: any) => ({ networkConfig: {} });

/** Minimal mock wallet state */
const mockWallet = {
  name: "MockWallet",
  icon: "",
};
let connected = true;
let currentAccount: any = { address: "0xMOCK_WALLET" };

export function useCurrentAccount() {
  return connected ? currentAccount : null;
}
export function useCurrentWallet() {
  return { currentWallet: mockWallet } as any;
}
export function useWallets() {
  return [{ ...mockWallet, id: "mock" } as any];
}
export function useConnectWallet() {
  return {
    mutateAsync: async (_: any) => {
      connected = true;
      currentAccount = { address: "0xMOCK_WALLET" };
      return { ...mockWallet };
    },
    isPending: false,
  } as any;
}
export function useDisconnectWallet() {
  return {
    mutateAsync: async () => {
      connected = false;
      currentAccount = null as any;
    },
  } as any;
}

/** Mock signers */
export function useSignPersonalMessage() {
  return {
    mutateAsync: async (_: { message: Uint8Array }) => ({
      bytes: "0xDEADBEEF",
      signature: "0xMOCK_SIGNATURE",
    }),
  } as any;
}

/** Provide a very small surface that our hooks use */
export function makeSuiClient() {
  const coinBalances = makeCoinBalances();

  return {
    getCoins: async ({ owner, coinType }: any) => {
      const list = coinType
        ? coinBalances.filter((c) => c.coinType === coinType)
        : coinBalances;
      return {
        data: list.map((c, i) => ({
          coinType: c.coinType,
          coinObjectId: `0xCOIN_${i}`,
          version: "1",
          digest: "0xD",
          balance: c.totalBalance,
          lockedUntilEpoch: null,
        })),
        hasNextPage: false,
        nextCursor: null,
      };
    },
    getBalance: async ({ owner, coinType }: any) => {
      const item = coinBalances.find((c) => c.coinType === coinType);
      return { coinType, totalBalance: item?.totalBalance ?? "0" };
    },
    getAllBalances: async ({ owner }: any) => {
      return coinBalances.map((c) => ({ coinType: c.coinType, totalBalance: c.totalBalance }));
    },
    multiGetObjects: async () => [],
    getDynamicFieldObject: async (_: any) => ({
      data: { content: { fields: { value: [] } } },
    }),
    waitForTransaction: async (_: any) => ({
      events: [
        {
          type: "0xMOCK::vault::DepositWithSigTimeEvent",
          parsedJson: { amount: ONE_MILLION, lp: ONE_MILLION },
        },
      ],
    }),
  } as any;
}

/** Mock sui client hooks */
export function useSuiClient() {
  return makeSuiClient() as any;
}
export function useSuiClientQuery(method?: string, params?: any, _options?: any) {
  const cacheRef = React.useRef<Record<string, any>>({});
  const key = React.useMemo(() => `${method ?? ""}:${JSON.stringify(params ?? {})}`, [method, params]);

  if (!(key in cacheRef.current)) {
    if (method === "multiGetObjects") {
      const ids: string[] = params?.ids ?? [];
      cacheRef.current[key] = ids.map((id) => ({
        data: {
          objectId: id,
          content: {
            fields: {
              rate: "1000000",
              withdraw: { fields: { fee_bps: "0", min: "0", total_fee: "0" } },
              deposit: { fields: { fee_bps: "0", min: "0", total_fee: "0" } },
              lock_duration_ms: "0",
              pending_redeems: { fields: { id: { id: "0xPENDING_REDEEMS" } } },
            },
          },
        },
      }));
    } else if (method === "getObject") {
      cacheRef.current[key] = {
        data: {
          content: {
            fields: {
              rate: "1000000",
              withdraw: { fields: { fee_bps: "0", min: "0", total_fee: "0" } },
              deposit: { fields: { fee_bps: "0", min: "0", total_fee: "0" } },
              lock_duration_ms: "0",
              pending_redeems: { fields: { id: { id: "0xPENDING_REDEEMS" } } },
            },
          },
        },
      };
    } else {
      cacheRef.current[key] = undefined;
    }
  }

  return { data: cacheRef.current[key], isLoading: false, refetch: async () => {} } as any;
}

/** Mock signer+executor */
export function useSignAndExecuteTransaction() {
  return {
    mutateAsync: async (_: any) => {
      // pretend tx succeeded
      return {
        digest: "0xMOCK_TX_DIGEST",
        effects: { status: { status: "success" } },
      };
    },
    isPending: false,
  } as any;
}
