import { useEffect } from "react";

import HeroBanner from "@/components/dashboard/hero-banner";
import "@/styles/design-tokens.css";

import { VaultList } from "@/components/vault/list";
import { useWhiteListModalStore } from "@/hooks/use-store";
import { useWallet } from "@/hooks/use-wallet";
import { useWhitelistWallet } from "@/hooks/use-whitelist-wallet";
import { truncateBetween } from "@/utils/truncate";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageContainer } from "@/components/layout/page-container";

export default function NodoAIVaults() {
  const { isWhitelisted, isLoading: isCheckingWhitelist } =
    useWhitelistWallet();
  const { address } = useWallet();
  const { isConnectWalletDialogOpen, openConnectWalletDialog } = useWallet();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const referralCode = searchParams.get("invite-ref");
  const { setIsOpen } = useWhiteListModalStore();

  useEffect(() => {
    if (referralCode) {
      window.sessionStorage.setItem("ref-code", referralCode);
      navigate("/");
      openConnectWalletDialog();
    }
  }, [referralCode]);

  useEffect(() => {
    if (window.localStorage.getItem("is-whitelist-address") === null) {
      window.localStorage.setItem("is-whitelist-address", "false");
    }

    if (address && isWhitelisted) {
      window.localStorage.setItem("is-whitelist-address", "true");
    }

    if (isCheckingWhitelist) {
      return;
    }

    const isWhitelistModalShown = window.localStorage.getItem(
      "is-whitelist-address"
    );

    if (address && !isWhitelisted) {
      const currentAddress = truncateBetween(address, 5, 5);
      const storedAddress = window.localStorage.getItem("current-address");
      if (currentAddress !== storedAddress) {
        window.localStorage.setItem("is-whitelist-address", "false");
        window.localStorage.setItem("current-address", currentAddress);
      }
    }

    const timer = setTimeout(() => {
      if (isWhitelistModalShown === "false" && !isConnectWalletDialogOpen) {
        setIsOpen(true);
        window.localStorage.setItem("is-whitelist-address", "true");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isWhitelisted, address, isConnectWalletDialogOpen, isCheckingWhitelist]);

  return (
    <PageContainer className="pb-6">
      <HeroBanner />
      <VaultList />
    </PageContainer>
  );
}
