import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";

import useStreaming from "@/hooks/useStreaming";
// import clsx from "clsx";
import Button from "./styled/Button";
import { reloadCurrentPage } from "@/utils";

interface Props {}

const InactiveScreen: FC<Props> = () => {
  const { t } = useTranslation();
  const { stopStreaming } = useStreaming();
  // const [reloadVisible, setReloadVisible] = useState(false);
  useEffect(() => {
    console.info("debug SSE: stopStreaming at inactive screen");
    stopStreaming();
    const currTitle = document.title;
    document.title = `[INACTIVE] ${currTitle}`;
    return () => {
      document.title = currTitle;
    };
  }, []);
  const handleReload = () => {
    reloadCurrentPage();
  };
  return (
    <div className="w-screen h-screen dark:bg-gray-700 flex-center text-4xl font-bold">
      <div className="flex flex-col items-center text-center gap-2">
        <h1 className="text-lg md:text-4xl dark:text-white font-bold">{t("inactive.title")}</h1>
        <p className="text-gray-400 text-xs md:text-sm font-semibold">{t("inactive.desc")}</p>
        <Button className="mt-4 uppercase" onClick={handleReload}>
          {t("action.reload")}
        </Button>
      </div>
    </div>
  );
};

export default InactiveScreen;
