import { ReactNode } from "react";

type Props = {
  header?: ReactNode;
  left: ReactNode;
  right: ReactNode;
  topOffsetPx?: number;
};

export default function StickyAsideLayout({
  header,
  left,
  right,
  topOffsetPx = 96,
}: Props) {
  return (
    <div className="min-h-screen w-full xl:overflow-hidden">
      {header}
      <div className="mx-auto w-full max-w-[1440px] px-4 lg:px-6">
        {/* Grid container: two columns on xl+, single column below */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_400px] 2xl:grid-cols-[1fr_440px]">
          {/* LEFT — scrollable column on xl+ */}
          <div
            className="
              order-2 xl:order-1
              xl:overflow-y-auto
              xl:pb-24
              xl:h-[calc(100vh-var(--vault-header-h,320px))]
              pr-0 xl:pr-2
            "
          >
            {left}
          </div>

          {/* RIGHT — sticky aside (all sizes), with internal scroll cap on xl+ */}
          <aside
            className="
              order-1 xl:order-2
              sticky self-start
            "
            style={{ top: topOffsetPx }}
          >
            <div className="xl:max-h-[calc(100vh-96px)] xl:overflow-y-auto">
              {right}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

