// import React from 'react'
import { useTranslation } from "react-i18next";

import SettingBlock from "@/components/SettingBlock";
import StyledRadio from "@/components/styled/Radio";

// type Props = {}

const Index = () => {
  const { t, i18n } = useTranslation("setting");
  const handleGuestToggle = (v: "zh" | "en") => {
    i18n.changeLanguage(v);
  };
  return (
    <SettingBlock title={t("overview.lang.title")} desc={t("overview.lang.desc")}>
      <StyledRadio
        options={[
          t("overview.lang.en"),
          t("overview.lang.zh"),
          t("overview.lang.jp"),
          t("overview.lang.tr"),
          t("overview.lang.pt")
        ]}
        values={["en", "zh", "jp", "tr", "pt"]}
        value={i18n.language.split("-")[0]}
        onChange={(v) => {
          console.log("wtff", v);

          handleGuestToggle(v);
        }}
      />
    </SettingBlock>
  );
};

export default Index;
