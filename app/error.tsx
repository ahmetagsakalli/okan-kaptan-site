"use client";

import { RotateCcw } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="state-page">
      <RotateCcw size={36} aria-hidden="true" />
      <h1>Bir aksilik oldu.</h1>
      <p>Sayfayı tekrar yükleyerek devam edebilirsiniz.</p>
      <button className="btn btn-primary" type="button" onClick={reset}>
        Tekrar dene
      </button>
    </main>
  );
}
