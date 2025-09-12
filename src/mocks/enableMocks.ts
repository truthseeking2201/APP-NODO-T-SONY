// src/mocks/enableMocks.ts
import { IS_MOCK } from "@/config/mock";
import { worker } from "./browser";

/**
 * Start MSW before rendering the app.
 */
export async function enableMocking() {
  if (!IS_MOCK) return;
  await worker.start({
    onUnhandledRequest: "bypass",
    serviceWorker: { url: "/mockServiceWorker.js" },
  });
}

