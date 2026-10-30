"use client";

/**
 * GDPR consent state, shared across the app.
 *
 * Analytics (GA4) must NOT load until the visitor explicitly accepts. We keep
 * the choice in localStorage so returning visitors are not asked again, and
 * expose it through a context so the banner and the analytics loader stay in
 * sync. "unset" means we have not asked / no choice yet.
 *
 * localStorage is an external store, so we read it with useSyncExternalStore:
 * the server snapshot is always "unset" / not ready, which keeps hydration safe.
 */

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";

export type ConsentStatus = "unset" | "granted" | "denied";

const STORAGE_KEY = "ts-cookie-consent";
const CHANGE_EVENT = "ts-consent-change";

interface ConsentContextValue {
  status: ConsentStatus;
  /** True once we are rendering on the client (avoids banner flashes). */
  ready: boolean;
  accept: () => void;
  reject: () => void;
  reset: () => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

function readStored(): ConsentStatus {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (value === "granted" || value === "denied") return value;
  } catch {
    // localStorage can be unavailable (private mode, blocked); fall back to "unset".
  }
  return "unset";
}

function writeStored(status: ConsentStatus) {
  try {
    if (status === "unset") window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, status);
  } catch {
    // Ignore storage write failures; the in-page event still updates the UI.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  // Same-tab changes use our custom event; other tabs fire "storage".
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

const noopSubscribe = () => () => {};

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const status = useSyncExternalStore(subscribe, readStored, () => "unset" as const);
  const ready = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const update = useCallback((next: ConsentStatus) => writeStored(next), []);

  const value: ConsentContextValue = {
    status,
    ready,
    accept: () => update("granted"),
    reject: () => update("denied"),
    reset: () => update("unset"),
  };

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used within a ConsentProvider");
  return ctx;
}
