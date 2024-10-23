import React from "react";
import App from "../App";

export default async function Layout({ children }: { children: React.ReactNode; params?: { [key: string]: string | string[] | undefined } }) {
  return <App>{children}</App>;
}
