import { create } from 'zustand'

type ValueUnit = '$' | 'SUI'

type State = {
  unit: ValueUnit
  suiPriceUsd: number | null
}

type Actions = {
  setUnit: (u: ValueUnit) => void
  ensureSuiPrice: () => Promise<void>
}

export const useValueUnitStore = create<State & Actions>((set, get) => ({
  unit: (typeof window !== 'undefined' && (localStorage.getItem('value_unit') as ValueUnit)) || '$',
  suiPriceUsd: null,
  setUnit: (u) => {
    try { localStorage.setItem('value_unit', u) } catch {}
    set({ unit: u })
    if (u === 'SUI' && get().suiPriceUsd == null) {
      get().ensureSuiPrice()
    }
  },
  ensureSuiPrice: async () => {
    try {
      const res = await fetch('/data-management/external/vaults/token-prices', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ids: ['SUI'] }),
      })
      if (!res.ok) return
      const arr = await res.json()
      const p = Array.isArray(arr) ? Number(arr.find((x: any) => x.id === 'SUI')?.price) : Number(arr?.price)
      if (isFinite(p) && p > 0) set({ suiPriceUsd: p })
    } catch {}
  },
}))

export const convertUsd = (usd: number, unit: ValueUnit, suiPriceUsd: number | null) => {
  if (unit === '$') return usd
  const p = suiPriceUsd || 0
  return p > 0 ? usd / p : 0
}

