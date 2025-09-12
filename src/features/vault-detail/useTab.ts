import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export type VaultTab = "overview" | "holdings";

export function useVaultTab(): [VaultTab, (t: VaultTab) => void] {
  const nav = useNavigate();
  const loc = useLocation();
  const current: VaultTab = useMemo(() => {
    const q = new URLSearchParams(loc.search);
    const t = (q.get("tab") || "").toLowerCase();
    return t === "holdings" ? "holdings" : "overview";
  }, [loc.search]);

  const setTab = (t: VaultTab) => {
    const q = new URLSearchParams(loc.search);
    q.set("tab", t);
    nav({ search: q.toString() }, { replace: true });
  };

  return [current, setTab];
}

