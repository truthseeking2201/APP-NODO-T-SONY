// src/config/mock.ts
/**
 * Mock mode is ON by default in dev or when the env is absent.
 * Set VITE_USE_MOCKS="false" to turn off.
 */
export const IS_MOCK =
  typeof import.meta.env?.VITE_USE_MOCKS === "string"
    ? import.meta.env.VITE_USE_MOCKS !== "false"
    : true;

