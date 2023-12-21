// import React from 'react'
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import SettingBlock from "@/components/SettingBlock";
import StyledRadio from "@/components/styled/Radio";
import {
  useGetSystemCommonQuery,
  useUpdateSystemCommonMutation
} from "../../../app/services/server";
import { useAppSelector } from "../../../app/store";
import { ChatLayout } from "../../../types/server";
import { shallowEqual } from "react-redux";

// type Props = {}

const Index = () => {
  const currStatus = useAppSelector(
    (store) => store.server.chat_layout_mode ?? "Left",
    shallowEqual
  );
  const { t } = useTranslation("setting", { keyPrefix: "overview.chat_layout" });
  const { t: ct } = useTranslation();
  const { refetch } = useGetSystemCommonQuery();
  const [updateSetting, { isSuccess }] = useUpdateSystemCommonMutation();
  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(ct("tip.update"));
    }
  }, [isSuccess]);
  const handleChange = (newVal: ChatLayout) => {
    updateSetting({ chat_layout_mode: newVal });
  };
  // if (!loadSuccess) return null;
  return (
    <SettingBlock title={t("title")} desc={t("desc")}>
      <StyledRadio
        options={[t("left"), t("self_right")]}
        values={["Left", "SelfRight"]}
        value={currStatus}
        onChange={handleChange}
      />
    </SettingBlock>
  );
};

export default Index;
