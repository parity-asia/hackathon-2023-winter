import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useLazyGetGeneratedLicenseQuery } from "@/app/services/server";
import Button from "@/components/styled/Button";
import useLicense from "@/hooks/useLicense";

type Props = {
  sid: string;
};

const PaymentSuccess = ({ sid }: Props) => {
  const { t } = useTranslation("setting", { keyPrefix: "license" });
  const navigateTo = useNavigate();
  const { upsertLicense, upserting, upserted } = useLicense();
  const [getGeneratedLicense, { data, isError, isLoading, isSuccess }] =
    useLazyGetGeneratedLicenseQuery();
  useEffect(() => {
    if (sid) {
      getGeneratedLicense(sid);
    }
  }, [sid]);
  useEffect(() => {
    if (isSuccess && data) {
      const l = data.license;
      upsertLicense(l);
    }
  }, [data, isSuccess]);
  const handleBack = () => {
    navigateTo("/");
  };
  return (
    <section className="flex flex-col items-center bg-slate-100 dark:bg-slate-800 rounded-2xl w-4/5 md:w-[512px] p-6">
      <img
        className="w-28 h-28"
        src="https://s.voce.chat/web_client/assets/img/check.png"
        alt="check icon"
      />
      <h1 className="font-bold text-3xl pt-5">{t("payment_success")}</h1>
      <p className="text-lg pb-7 mt-2 text-gray-400 dark:text-gray-600">
        {upserting ? t("tip_renewing") : ""}
        {upserted ? t("tip_renewed") : ""}
        {isError ? t("tip_renew_error") : ""}
      </p>
      <Button disabled={isLoading || upserting} className="back" onClick={handleBack}>
        {t("back_home")}
      </Button>
    </section>
  );
};

export default PaymentSuccess;
