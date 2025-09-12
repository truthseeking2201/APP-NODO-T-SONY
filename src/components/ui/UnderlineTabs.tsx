import * as React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

type Item = { value: string; label: string };
type Props = {
  value: string;
  onValueChange: (v: string) => void;
  items: Item[];
  className?: string;
};

export function UnderlineTabs({ value, onValueChange, items, className }: Props) {
  const refs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const barRef = React.useRef<HTMLDivElement | null>(null);
  const [indicator, setIndicator] = React.useState({ left: 0, width: 0 });

  const measure = React.useCallback(() => {
    const el = refs.current[value];
    const parent = barRef.current;
    if (!el || !parent) return;
    const rect = el.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    setIndicator({ left: rect.left - parentRect.left, width: rect.width });
  }, [value]);

  React.useLayoutEffect(() => {
    measure();
  }, [measure, items]);

  React.useEffect(() => {
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure]);

  return (
    <div className={clsx("relative select-none", className)}>
      <div
        ref={barRef}
        role="tablist"
        className="flex justify-start gap-8 md:gap-10 text-sm md:text-base font-medium text-white/60 pb-3 border-b border-white/10"
      >
        {items.map((it) => (
          <button
            key={it.value}
            ref={(n) => (refs.current[it.value] = n)}
            role="tab"
            aria-selected={value === it.value}
            onClick={() => onValueChange(it.value)}
            className={clsx(
              "pb-3 transition-colors duration-200",
              value === it.value ? "text-white" : "hover:text-white/80"
            )}
          >
            {it.label}
          </button>
        ))}
      </div>
      <motion.div
        className="absolute bottom-0 h-[2px] rounded-full bg-gradient-to-r from-[#FFE8C9] via-[#E3F6FF] to-[#C9D4FF]"
        animate={{ left: indicator.left, width: indicator.width }}
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
      />
    </div>
  );
}
