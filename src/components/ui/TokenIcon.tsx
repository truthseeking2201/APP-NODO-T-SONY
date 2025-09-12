import * as React from 'react';

const REGISTRY: Record<string, string> = {
  USDC: '/coins/usdc.png',
  SUI:  '/coins/sui.png',
  NDLP: '/coins/ndlp.png',
  NOVA: '/dexs/flowx.png',
  Cetus:'/dexs/cetus.png',
};

function Fallback({ symbol }: { symbol: string }) {
  return (
    <div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold text-white">
      {symbol?.slice(0,2).toUpperCase()}
    </div>
  );
}

export function TokenIcon({ symbol, className='h-5 w-5 rounded-full' }:{symbol?:string,className?:string}) {
  const src = symbol ? REGISTRY[symbol] : undefined;
  if (!src) return <Fallback symbol={symbol || '?'} />;
  return <img src={src} alt={symbol} className={className}
              onError={(e)=>{(e.currentTarget as HTMLImageElement).style.display='none'}} />;
}

export function DexIcon({ name, className='h-4 w-4 rounded' }:{name?:string,className?:string}) {
  const src = name ? REGISTRY[name] : undefined;
  if (!src) return <Fallback symbol={name || 'DX'} />;
  return <img src={src} alt={name} className={className}
              onError={(e)=>{(e.currentTarget as HTMLImageElement).style.display='none'}} />;
}

export function NetworkIcon({ name='SUI', className='h-4 w-4 rounded-full' }:{name?:string,className?:string}) {
  const src = REGISTRY[name] ?? '/coins/sui.png';
  return <img src={src} alt={name} className={className}
              onError={(e)=>{(e.currentTarget as HTMLImageElement).style.display='none'}} />;
}

