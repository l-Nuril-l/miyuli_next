"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { AppStore, makeStore } from "../../lib/store";

export type StoreInitialVlaues = {
  isMobileDevice: boolean;
  theme: string | undefined;
  auth: {
    session: any;
    account: any;
  };
};

export default function StoreProvider({ children, storeInitialValues }: { children: React.ReactNode; storeInitialValues: StoreInitialVlaues }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore(storeInitialValues);
    // storeRef.current.dispatch(initializeCount(3));
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
