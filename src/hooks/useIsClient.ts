import { useSyncExternalStore } from "react";

function emptySubscribe() {
  return () => {};
}

/** True after hydration; false during SSR. Avoids setState-in-effect for client-only UI. */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
