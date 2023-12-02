import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { isEqual } from "lodash";

import {
  useLazyGetAgoraConfigQuery,
  useLazyGetFirebaseConfigQuery,
  useLazyGetLoginConfigQuery,
  useLazyGetSMTPConfigQuery,
  useUpdateAgoraConfigMutation,
  useUpdateFirebaseConfigMutation,
  useUpdateLoginConfigMutation,
  useUpdateSMTPConfigMutation
} from "@/app/services/server";
import { AgoraConfig, FirebaseConfig, LoginConfig, SMTPConfig } from "@/types/server";

// config: smtp agora login firebase
type ConfigType = "smtp" | "agora" | "login" | "firebase";
type ConfigMap = Record<ConfigType, AgoraConfig | FirebaseConfig | LoginConfig | SMTPConfig>;
type valuesOf<T> = T[keyof T];
let originalValue: valuesOf<ConfigMap> | undefined = undefined;
// type valueOf<T,config as ConfigType> = T[config];
export default function useConfig(config: keyof ConfigMap = "smtp") {
  const { t: ct } = useTranslation();
  const [changed, setChanged] = useState(false);
  const [values, setValues] = useState<valuesOf<ConfigMap> | undefined>(undefined);
  const [updateLoginConfig, { isSuccess: LoginUpdated, isLoading: LoginUpdating }] =
    useUpdateLoginConfigMutation();
  const [updateSMTPConfig, { isSuccess: SMTPUpdated, isLoading: SMTPUpdating }] =
    useUpdateSMTPConfigMutation();
  const [updateAgoraConfig, { isSuccess: AgoraUpdated, isLoading: AgoraUpdating }] =
    useUpdateAgoraConfigMutation();
  const [updateFirebaseConfig, { isSuccess: FirebaseUpdated, isLoading: FirebaseUpdating }] =
    useUpdateFirebaseConfigMutation();
  const [getAgoraConfig, { data: agoraConfig }] = useLazyGetAgoraConfigQuery();
  const [getLoginConfig, { data: loginConfig }] = useLazyGetLoginConfigQuery();
  const [getSMTPConfig, { data: smtpConfig }] = useLazyGetSMTPConfigQuery();
  const [getFirebaseConfig, { data: firebaseConfig }] = useLazyGetFirebaseConfigQuery();

  const updateFns = {
    login: updateLoginConfig,
    smtp: updateSMTPConfig,
    agora: updateAgoraConfig,
    firebase: updateFirebaseConfig
  };
  const requests = {
    smtp: getSMTPConfig,
    agora: getAgoraConfig,
    firebase: getFirebaseConfig,
    login: getLoginConfig
  };
  const updates = {
    login: LoginUpdated,
    smtp: SMTPUpdated,
    agora: AgoraUpdated,
    firebase: FirebaseUpdated
  };
  const updatings = {
    login: LoginUpdating,
    smtp: SMTPUpdating,
    agora: AgoraUpdating,
    firebase: FirebaseUpdating
  };
  const updateConfig = updateFns[config];
  const refetch = requests[config];
  const updated = updates[config];
  const updating = updatings[config];
  const reset = () => {
    setValues(undefined);
  };

  const toggleEnable = () => {
    setValues((prev) => {
      if (prev && "enabled" in prev) {
        return { ...prev, enabled: !prev.enabled };
      }
      return prev;
    });
  };

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (updated) {
      toast.success(ct("tip.update"));
      // setChanged(false);
      refetch();
    }
  }, [updated]);
  useEffect(() => {
    const _config = smtpConfig || firebaseConfig || loginConfig || agoraConfig;
    if (_config) {
      originalValue = _config;
      setValues(_config);
    }
  }, [smtpConfig, firebaseConfig, loginConfig, agoraConfig]);
  useEffect(() => {
    // 空对象
    if (!values || Object.keys(values).length == 0) return;
    if (!isEqual(originalValue, values)) {
      setChanged(true);
    } else {
      setChanged(false);
    }
  }, [values]);

  return {
    originalValues: originalValue,
    updating,
    updated,
    reset,
    changed,
    updateConfig,
    agoraConfig,
    values,
    setValues,
    toggleEnable
  };
}
