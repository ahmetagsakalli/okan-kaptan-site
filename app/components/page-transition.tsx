"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

type PageTransitionProps = {
  children: ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") === true;
  const firstRender = useRef(true);
  const transitionTimeoutRef = useRef<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      return;
    }

    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    setIsTransitioning(true);
    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
    }

    transitionTimeoutRef.current = window.setTimeout(() => {
      setIsTransitioning(false);
      transitionTimeoutRef.current = null;
    }, 170);

    return () => {
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [isAdmin, pathname]);

  useEffect(() => {
    if (isAdmin) {
      return;
    }

    const startTransition = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      if (!(event.target instanceof Element)) {
        return;
      }

      const link = event.target.closest<HTMLAnchorElement>("a[href]");

      if (!link || link.target || link.hasAttribute("download")) {
        return;
      }

      const href = link.getAttribute("href");

      if (!href || href.startsWith("#") || href.startsWith("tel:") || href.startsWith("mailto:")) {
        return;
      }

      const nextUrl = new URL(link.href);

      if (
        nextUrl.origin !== window.location.origin ||
        nextUrl.pathname.startsWith("/admin") ||
        (nextUrl.pathname === window.location.pathname && nextUrl.search === window.location.search)
      ) {
        return;
      }

      setIsTransitioning(true);

      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }

      transitionTimeoutRef.current = window.setTimeout(() => {
        setIsTransitioning(false);
        transitionTimeoutRef.current = null;
      }, 420);
    };

    document.addEventListener("click", startTransition, true);

    return () => {
      document.removeEventListener("click", startTransition, true);
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [isAdmin]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <div
        className={`page-transition-overlay ${isTransitioning ? "is-active" : ""}`}
        aria-hidden="true"
      />
      <div className="page-transition-shell" key={pathname}>
        {children}
      </div>
    </>
  );
}
