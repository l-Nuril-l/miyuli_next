"use server";
import ScrollToTop from "@/components/ScrollToTop";
import SignalR from "@/SignalR";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import AudioService from "../../services/AudioService";
import CallService from "../../services/CallService";
import ModalService from "../../services/ModalService";
import NotificationService from "../../services/NotificationService";
import ClientProviders from "./ClientProviders";
import StoreProvider from "./StoreProvider";

export default async function Providers({ children }: { children: React.ReactNode }) {
  const headerStore = await headers();
  const cookiesStore = await cookies();
  const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(headerStore.get("user-agent") || "");
  const messages = await getMessages();
  axios.defaults.headers["Authorization"] = "Bearer " + cookiesStore.get("token");

  return (
    <StoreProvider
      storeInitialValues={{
        isMobileDevice,
        theme: cookiesStore.get("theme")?.value,
        auth: cookiesStore.get("auth")?.value,
      }}
    >
      <NuqsAdapter>
        <NextIntlClientProvider messages={messages}>
          <GoogleOAuthProvider clientId={process.env.NEXT_GOOGLE_CLIENT_ID!}>
            <SignalR>
              <ClientProviders>
                <AudioService>
                  {children}
                  <div id="modal"></div>
                  <ModalService />
                  <NotificationService />
                  <CallService />
                  <ScrollToTop />
                </AudioService>
              </ClientProviders>
            </SignalR>
          </GoogleOAuthProvider>
        </NextIntlClientProvider>
      </NuqsAdapter>
    </StoreProvider>
  );
}
