"use client";
import { getSelf } from "@/lib/features/auth";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import axios from "axios";
import React, { useEffect, useLayoutEffect } from "react";

const initialOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
  currency: "USD",
  intent: "capture",
};

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;
axios.defaults.headers["Content-Type"] = "application/json";
axios.defaults.formSerializer = {
  indexes: null,
};

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const authStore = useAppSelector((s) => s.auth);
  const API_URL = useAppSelector((s) => s.miyuli.API_URL);
  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      require("bootstrap/dist/js/bootstrap");
    }
  }, []);

  useEffect(() => {
    if (authStore.session) dispatch(getSelf());
  }, [dispatch, authStore.session, API_URL]);

  return (
    <PayPalScriptProvider deferLoading={true} options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
}
