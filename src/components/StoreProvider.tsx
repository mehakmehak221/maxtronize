"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";

import { sanitizeStaleAccessToken } from "@/lib/authToken";
import { makeStore, type AppStore } from "@/store/store";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (storeRef.current === null) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    sanitizeStaleAccessToken();
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
