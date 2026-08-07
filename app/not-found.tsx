import Link from "next/link";
import { Anchor } from "lucide-react";

export default function NotFound() {
  return (
    <main className="state-page">
      <Anchor size={36} aria-hidden="true" />
      <h1>Bu rota bulunamadı.</h1>
      <p>Mordoğan tekne turları ana sayfasına dönebilirsiniz.</p>
      <Link className="btn btn-primary" href="/">
        Ana sayfaya dön
      </Link>
    </main>
  );
}
