import { ReactNode } from "react";
import { SiteHeader } from "./site-header";

type DetailPageProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function DetailPage({ title, children }: DetailPageProps) {
  return (
    <main className="site-shell detail-shell">
      <SiteHeader />
      <h1 className="visually-hidden">{title}</h1>
      {children}
    </main>
  );
}
