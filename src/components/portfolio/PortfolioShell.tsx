import type { ReactNode } from "react";

type PortfolioShellProps = {
  sidebar: ReactNode;
  children: ReactNode;
};

export function PortfolioShell({
  sidebar,
  children,
}: PortfolioShellProps) {
  return (
    <div className="lg:grid lg:grid-cols-4 lg:gap-8">
      <aside className="mb-8 lg:col-span-1 lg:mb-0">{sidebar}</aside>
      <div className="lg:col-span-3">{children}</div>
    </div>
  );
}
