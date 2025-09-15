import {
  COIN_TYPES_CONFIG,
  LP_TOKEN_CONFIG,
  SUI_CONFIG,
} from "@/config/coin-config";
import { REFETCH_VAULT_DATA_INTERVAL } from "@/config/constants";
import { getBalanceAmountForInput } from "@/lib/number";
import { roundDownBalance } from "@/lib/utils";
import { UserCoinAsset } from "@/types/coin.types";
import { DepositVaultConfig } from "@/types/vault-config.types";
import {
  useCurrentAccount,
  useSuiClient,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import { SuiClient } from "@mysten/sui/client";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useUserAssetsStore } from "./use-store";
import { useCurrentDepositVault } from "./use-vault";
import { useWallet } from "./use-wallet";
interface CoinMetadata {
  decimals: number;
  name: string;
  symbol: string;
  url?: string;
  iconUrl?: string;
}

const getCoinObjects = async (
  suiClient: SuiClient,
  coinType: string,
  address: string
) => {
  let allCoins = [];
  let cursor = null;
  let hasNextPage = true;

  while (hasNextPage) {
    // Get a page of coins with optional cursor
    const coinsPage = await suiClient.getCoins({
      owner: address,
      cursor: cursor,
      coinType: coinType,
      limit: 50, // Number of items per page (default is 50)
    });

    // Add coins from this page to our collection
    allCoins = [...allCoins, ...coinsPage.data];

    // Update the cursor for the next page
    cursor = coinsPage.nextCursor;

    // Check if there are more pages
    hasNextPage = coinsPage.hasNextPage;
  }
  return allCoins;
};

const getAllCoinObjects = async (suiClient: SuiClient, address: string) => {
  let allCoins = [];
  let cursor = null;
  let hasNextPage = true;

  while (hasNextPage) {
    // Get a page of coins with optional cursor
    const coinsPage = await suiClient.getAllCoins({
      owner: address,
      cursor: cursor,
      limit: 50, // Number of items per page (default is 50)
    });

    // Add coins from this page to our collection
    allCoins = [...allCoins, ...coinsPage.data];

    // Update the cursor for the next page
    cursor = coinsPage.nextCursor;

    // Check if there are more pages
    hasNextPage = coinsPage.hasNextPage;
  }
  return allCoins;
};

export const useMyAssets = () => {
  const { address: currentAddress, isAuthenticated } = useWallet();
  const suiClient = useSuiClient();
  const queryClient = useQueryClient();

  const currentVault = useCurrentDepositVault();

  // Clear cache when account address becomes empty
  useEffect(() => {
    if (!currentAddress) {
      queryClient.removeQueries({ queryKey: ["lpCoinObjects"] });
      queryClient.removeQueries({ queryKey: ["collateralCoinObjects"] });
    }
  }, [currentAddress, queryClient]);

  const {
    data: lpCoinObjects,
    isLoading: lpCoinObjectsLoading,
    refetch: lpCoinObjectsRefetch,
  } = useQuery({
    queryKey: ["lpCoinObjects", currentAddress, currentVault.vault_id],
    queryFn: () =>
      getCoinObjects(
        suiClient,
        currentVault.vault_lp_token,
        currentAddress || ""
      ),
    enabled: isAuthenticated,
    staleTime: REFETCH_VAULT_DATA_INTERVAL,
    refetchInterval: REFETCH_VAULT_DATA_INTERVAL,
  });

  const {
    data: collateralCoinObjects,
    isLoading: collateralCoinObjectsLoading,
    refetch: collateralCoinObjectsRefetch,
  } = useQuery({
    queryKey: ["collateralCoinObjects", currentAddress],
    queryFn: () =>
      getCoinObjects(
        suiClient,
        currentVault.collateral_token,
        currentAddress || ""
      ),
    enabled: isAuthenticated,
    staleTime: REFETCH_VAULT_DATA_INTERVAL,
    refetchInterval: REFETCH_VAULT_DATA_INTERVAL,
  });

  const refreshBalance = useCallback(() => {
    lpCoinObjectsRefetch();
    collateralCoinObjectsRefetch();
  }, [lpCoinObjectsRefetch, collateralCoinObjectsRefetch]);

  const coinMetadata = useGetCoinsMetadata();
  const coinObjects = useMemo(() => {
    let res = [];
    if (lpCoinObjects && lpCoinObjects.length > 0) {
      res = [...res, ...lpCoinObjects];
    } else {
      res = [
        ...res,
        {
          coinType: currentVault.vault_lp_token,
          balance: 0,
        },
      ];
    }

    if (collateralCoinObjects && collateralCoinObjects.length > 0) {
      res = [...res, ...collateralCoinObjects];
    } else {
      res = [
        ...res,
        {
          coinType: currentVault.collateral_token,
          balance: 0,
        },
      ];
    }

    return res;
  }, [
    lpCoinObjects,
    collateralCoinObjects,
    currentVault.vault_lp_token,
    currentVault.collateral_token,
  ]);

  const assets: UserCoinAsset[] =
    coinObjects.reduce((acc, coin) => {
      const metadata = coinMetadata[coin.coinType] as CoinMetadata;
      const decimals = metadata?.decimals || 9;
      const rawBalance = Number(coin.balance || "0");
      const balance = rawBalance / Math.pow(10, decimals);

      const collateralToken = COIN_TYPES_CONFIG.collateral_tokens.find(
        (token) => token.id === coin.coinType
      );

      const existingAsset = acc.find(
        (asset) => asset.coin_type === coin.coinType
      );
      if (existingAsset) {
        existingAsset.balance += balance;
        existingAsset.raw_balance += rawBalance;
      } else {
        acc.push({
          coin_type: coin.coinType,
          balance,
          raw_balance: rawBalance,
          image_url: collateralToken
            ? collateralToken.image_url
            : LP_TOKEN_CONFIG.image_url,
          decimals: decimals,
          display_name: collateralToken
            ? collateralToken.display_name
            : LP_TOKEN_CONFIG.display_name,
          name: metadata?.name,
          symbol: metadata?.symbol,
        });
      }
      return acc;
    }, []) || [];

  return {
    assets: assets.map((asset) => ({
      ...asset,
      balance: getBalanceAmountForInput(
        asset.raw_balance,
        asset.decimals,
        asset.decimals
      ),
    })),
    isLoading: lpCoinObjectsLoading || collateralCoinObjectsLoading,
    refreshBalance,
  };
};

export const useGetCoinsMetadata = () => {
  const suiClient = useSuiClient();
  const currentVault = useCurrentDepositVault();

  const allowedCoinTypes = useMemo(() => {
    return [currentVault?.vault_lp_token, currentVault.collateral_token];
  }, [currentVault]);

  const coinsMetadata = useQueries({
    queries: allowedCoinTypes.map((coinType) => ({
      queryKey: ["getCoinMetadata", coinType],
      queryFn: () => suiClient.getCoinMetadata({ coinType }),
      staleTime: 1000 * 60 * 60 * 1, // 1 hour
    })),
  });

  const coinMetadata = coinsMetadata.reduce((acc, result, index) => {
    if (result.data) {
      acc[allowedCoinTypes[index]] = result.data;
    }
    return acc;
  }, {} as Record<string, CoinMetadata>);

  return coinMetadata;
};

export const useGetCoinBalance = (coinType: string, decimals: number) => {
  const { address: currentAddress, isAuthenticated } = useWallet();

  const { data: allCoins, refetch } = useSuiClientQuery(
    "getCoins",
    {
      owner: currentAddress,
      coinType,
    },
    {
      enabled: isAuthenticated && !!coinType,
    }
  );

  // Calculate the user's LP token balance
  const userLPBalance = useMemo(() => {
    if (!allCoins?.data) return 0;

    const totalBalance = allCoins.data.reduce((sum, coin) => {
      return sum + parseInt(coin.balance || "0") / Math.pow(10, decimals);
    }, 0);

    return totalBalance;
  }, [allCoins, decimals]);

  return { balance: roundDownBalance(userLPBalance, 2), refetch };
};

export const useGetVaultTokenPair = () => {
  const { assets } = useMyAssets();
  const depositVault = useCurrentDepositVault();

  const collateralToken = useMemo(
    () =>
      assets.find((asset) => asset.coin_type === depositVault.collateral_token),
    [assets, depositVault.collateral_token]
  );

  const lpToken = useMemo(
    () =>
      assets.find((asset) => asset.coin_type === depositVault.vault_lp_token),
    [assets, depositVault.vault_lp_token]
  );

  return { collateralToken, lpToken };
};

export const useFetchAssets = (vaults: DepositVaultConfig[] = []) => {
  const queryClient = useQueryClient();
  const { setAssets, setUpdated, updated, isRefetch, isLoading, setIsLoading } =
    useUserAssetsStore();
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const hasVaults = vaults?.length > 0;
  const prevAddress = useRef(account?.address);

  const collateralTokens = vaults
    .flatMap((a) => a.tokens)
    .filter(
      (token, index, self) =>
        index === self.findIndex((t) => t.token_address === token.token_address)
    )
    .map((token) => ({
      coinType: token.token_address,
      decimals: token.decimal,
      domainType: "collateral",
    }));

  const lpTokens = vaults.map((vault) => ({
    coinType: vault.vault_lp_token,
    decimals: vault.vault_lp_token_decimals,
    domainType: "lp",
  }));

  useEffect(() => {
    if (!account?.address && prevAddress.current) {
      setAssets([]);
      queryClient.removeQueries({
        queryKey: ["allCoinObjects", prevAddress.current],
      });
    } else {
      prevAddress.current = account?.address;
    }
  }, [account?.address, queryClient, setAssets]);

  const whitelistedCoinTypes = [...collateralTokens, ...lpTokens].reduce(
    (acc, coin) => {
      acc[coin.coinType] = {
        decimals: coin.decimals,
        domainType: coin.domainType,
      };
      return acc;
    },
    {}
  );

  const {
    data: allCoinObjects = [],
    isLoading: allCoinObjectsLoading,
    isFetching: allCoinObjectsFetching,
    refetch: allCoinObjectsRefetch,
  } = useQuery({
    queryKey: ["allCoinObjects", account?.address],
    queryFn: () => getAllCoinObjects(suiClient, account?.address || ""),
    enabled: !!account?.address && hasVaults,
    staleTime: Infinity,
    refetchInterval: REFETCH_VAULT_DATA_INTERVAL,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    const isFetching = allCoinObjectsFetching || allCoinObjectsLoading;
    if (isFetching) return;

    if (allCoinObjects.length === 0 && isLoading) {
      setIsLoading(false);
      return;
    }

    const assets: UserCoinAsset[] =
      allCoinObjects.reduce((acc, coin) => {
        let coinType = coin.coinType;
        if (coinType === "0x2::sui::SUI") {
          coinType = SUI_CONFIG.id;
        }

        const decimals = whitelistedCoinTypes[coinType]?.decimals || 9;
        const rawBalance = new BigNumber(coin.balance || "0");

        const domainType = whitelistedCoinTypes[coinType]?.domainType;
        const tokenDisplay =
          domainType === "collateral"
            ? COIN_TYPES_CONFIG.collateral_tokens.find(
                (token) => token.id === coinType
              )
            : LP_TOKEN_CONFIG;

        const existingAsset = acc.find((asset) => asset.coin_type === coinType);

        if (existingAsset) {
          existingAsset.raw_balance =
            existingAsset.raw_balance.plus(rawBalance);
        } else {
          acc.push({
            coin_type: coinType,
            balance: 0,
            raw_balance: rawBalance,
            image_url: tokenDisplay?.image_url,
            decimals: decimals,
            display_name: tokenDisplay?.display_name,
            name: tokenDisplay?.display_name,
            symbol: tokenDisplay?.display_name,
            domain_type: domainType,
          });
        }
        return acc;
      }, []) || [];

    Object.keys(whitelistedCoinTypes).forEach((coinType) => {
      // if coinType is not in assets, add it
      if (!assets.find((asset) => asset.coin_type === coinType)) {
        const tokenDisplay =
          whitelistedCoinTypes[coinType]?.domainType === "collateral"
            ? COIN_TYPES_CONFIG.collateral_tokens.find(
                (token) => token.id === coinType
              )
            : LP_TOKEN_CONFIG;
        assets.push({
          coin_type: coinType,
          balance: "0",
          balance_string: "0",
          raw_balance: "0",
          image_url: tokenDisplay?.image_url,
          decimals: whitelistedCoinTypes[coinType]?.decimals || 9,
          display_name: tokenDisplay?.display_name,
          name: tokenDisplay?.display_name,
          symbol: tokenDisplay?.display_name,
        });
      }
    });

    if (assets.length > 0 && !updated) {
      setAssets(
        assets.map((asset) => {
          const balance = getBalanceAmountForInput(
            asset.raw_balance,
            asset.decimals,
            asset.decimals
          ).toString();
          return {
            ...asset,
            raw_balance: new BigNumber(asset.raw_balance).toString(),
            balance: balance,
          };
        })
      );
    }
  }, [
    allCoinObjects,
    whitelistedCoinTypes,
    updated,
    setAssets,
    allCoinObjectsLoading,
    allCoinObjectsFetching,
    isLoading,
    setIsLoading,
  ]);

  useEffect(() => {
    if (isRefetch) {
      allCoinObjectsRefetch().then(() => {
        setUpdated(false);
      });
    }
  }, [isRefetch, allCoinObjectsRefetch, setUpdated]);
};
