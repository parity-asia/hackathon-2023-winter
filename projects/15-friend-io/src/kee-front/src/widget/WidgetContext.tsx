import { createContext, ReactNode, useContext } from "react";

import { useGetLoginConfigQuery, useGetServerQuery } from "../app/services/server";
import { useAppSelector } from "../app/store";
import { getContrastColor, isInIframe } from "../utils";
import { shallowEqual } from "react-redux";

const query = new URLSearchParams(location.search);
const welcome = decodeURIComponent(query.get("welcome") || "");
const color = decodeURIComponent(query.get("themeColor") || "#1fe1f9");
const from = decodeURIComponent(query.get("from") || "widget.link");
const fgColor = getContrastColor(color);
const embed = isInIframe();
const WidgetContext = createContext({
  color,
  fgColor,
  // 判断是否是iframe上下文
  embed,
  from,
  loading: true,
  inviteOnly: false,
  name: "",
  logo: "",
  welcome
});

function WidgetProvider({ children }: { children: ReactNode }) {
  const { isLoading: loadingServerData } = useGetServerQuery();
  const { isLoading: loadingConfig, data: loginConfig } = useGetLoginConfigQuery();
  const serverData = useAppSelector((store) => store.server, shallowEqual);

  const loading = loadingConfig || loadingServerData;
  // if(loading) return
  return (
    <WidgetContext.Provider
      value={{
        welcome,
        loading,
        color,
        fgColor,
        embed,
        from,
        inviteOnly: loginConfig?.who_can_sign_up == "InvitationOnly",
        name: serverData?.name,
        logo: serverData.logo
      }}
    >
      {children}
    </WidgetContext.Provider>
  );
}

function useWidget() {
  const context = useContext(WidgetContext);
  if (context === undefined) {
    throw new Error("useWidget must be used within a WidgetProvider");
  }
  return context;
}

export { WidgetProvider, useWidget };
