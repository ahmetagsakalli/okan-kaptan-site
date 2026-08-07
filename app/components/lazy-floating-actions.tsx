"use client";

import { useEffect, useState, type ComponentType } from "react";

export function LazyFloatingActions() {
  const [FloatingActions, setFloatingActions] = useState<ComponentType | null>(null);

  useEffect(() => {
    if (window.location.pathname.startsWith("/admin")) {
      return;
    }

    let cancelled = false;
    let timerId: ReturnType<typeof setTimeout> | undefined;
    let idleId: number | undefined;

    const loadFloatingActions = () => {
      void import("./floating-actions").then((module) => {
        if (!cancelled) {
          setFloatingActions(() => module.FloatingActions);
        }
      });
    };

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(loadFloatingActions, { timeout: 2500 });
    } else {
      timerId = globalThis.setTimeout(loadFloatingActions, 1800);
    }

    return () => {
      cancelled = true;

      if (idleId !== undefined) {
        window.cancelIdleCallback(idleId);
      }

      if (timerId !== undefined) {
        globalThis.clearTimeout(timerId);
      }
    };
  }, []);

  return FloatingActions ? <FloatingActions /> : null;
}
