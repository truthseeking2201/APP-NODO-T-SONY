import { UserCoinAsset } from "@/types/coin.types";
import { SCVaultConfig } from "@/types/vault-config.types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface DepositVaultState {
  depositVault: string | null;
  setDepositVault: (depositVault: string) => void;
}

const depositVaultStore = create<DepositVaultState>((set) => ({
  depositVault: null,
  setDepositVault: (vaultId: string) => set({ depositVault: vaultId }),
}));

export const useDepositVaultStore = () => {
  const depositVault = depositVaultStore((state) => state.depositVault);
  const setDepositVault = depositVaultStore((state) => state.setDepositVault);
  return {
    depositVault,
    setDepositVault,
  };
};

type WhiteListModalState = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const whiteListModalStore = create<WhiteListModalState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));

export const useWhiteListModalStore = () => {
  const isOpen = whiteListModalStore((state) => state.isOpen);
  const setIsOpen = whiteListModalStore((state) => state.setIsOpen);
  return {
    isOpen,
    setIsOpen,
  };
};

interface UserAssetsState {
  assets: UserCoinAsset[];
  updated: boolean;
  isRefetch: boolean;
  isLoading: boolean;
  updatedAt: number;
  setAssets: (assets: UserCoinAsset[]) => void;
  setRefetch: () => void;
  setUpdated: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
}

const userAssetsStore = create<UserAssetsState>()(
  devtools((set) => ({
    assets: [],
    updated: false,
    isRefetch: false,
    isLoading: true,
    setRefetch: () => set({ isRefetch: true }),
    setUpdated: (value: boolean) => set({ updated: value }),
    setAssets: (assets: UserCoinAsset[]) => {
      set({
        assets,
        isRefetch: false,
        isLoading: false,
        updated: assets.length > 0 ? true : false,
        updatedAt: Date.now(),
      });
    },
    setDefaultAssets: (assets: UserCoinAsset[]) => set({ assets }),
    setIsLoading: (value: boolean) => set({ isLoading: value }),
  }))
);

interface VaultObjectConfigState {
  vaultObjects: SCVaultConfig[];
  setVaultObjects: (vaults: SCVaultConfig[]) => void;
}

const vaultObjectStore = create<VaultObjectConfigState>()((set) => ({
  vaultObjects: [],
  setVaultObjects: (vaults: SCVaultConfig[]) => set({ vaultObjects: vaults }),
}));

export const useVaultObjectStore = () => {
  const vaultObjects = vaultObjectStore((state) => state.vaultObjects);
  const setVaultObjects = vaultObjectStore((state) => state.setVaultObjects);
  return { vaultObjects, setVaultObjects };
};

export const useUserAssetsStore = () => {
  const assets = userAssetsStore((state) => state.assets);
  const setAssets = userAssetsStore((state) => state.setAssets);
  const updated = userAssetsStore((state) => state.updated);
  const isRefetch = userAssetsStore((state) => state.isRefetch);
  const isLoading = userAssetsStore((state) => state.isLoading);
  const setRefetch = userAssetsStore((state) => state.setRefetch);
  const setUpdated = userAssetsStore((state) => state.setUpdated);
  const setIsLoading = userAssetsStore((state) => state.setIsLoading);
  return {
    assets,
    updated,
    setAssets,
    isRefetch,
    setRefetch,
    isLoading,
    setUpdated,
    setIsLoading,
  };
};

export const useGetCoinByType = (coinType: string) => {
  const assets = userAssetsStore((state) => state.assets);
  return assets.find((asset) => asset.coin_type === coinType);
};
