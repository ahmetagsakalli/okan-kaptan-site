"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const revealSelector = ".reveal-item";

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(revealSelector));

    if (!elements.length) {
      return;
    }

    document.body.classList.add("reveal-ready");

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const markVisible = (element: HTMLElement) => {
      element.classList.add("is-visible");
    };

    const revealVisibleElements = () => {
      elements.forEach((element) => {
        if (element.classList.contains("is-visible")) {
          return;
        }

        const rect = element.getBoundingClientRect();
        const verticalBuffer = window.innerHeight * 0.8;

        if (rect.top < window.innerHeight + verticalBuffer && rect.bottom > -verticalBuffer) {
          markVisible(element);
          observer.unobserve(element);
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          markVisible(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "480px 0px 480px 0px",
        threshold: 0.01,
      },
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    requestAnimationFrame(revealVisibleElements);
    const safetyTimer = window.setTimeout(revealVisibleElements, 350);

    return () => {
      window.clearTimeout(safetyTimer);
      observer.disconnect();
      document.body.classList.remove("reveal-ready");
    };
  }, [pathname]);

  return null;
}
