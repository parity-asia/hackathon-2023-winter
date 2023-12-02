import { FC } from "react";
import { useTranslation } from "react-i18next";

import IconClose from "@/assets/icons/close.svg";
import Modal from "../Modal";
import Button from "../styled/Button";

interface Props {
  handleInstall?: () => void;
  closePrompt?: () => void;
}

const Prompt: FC<Props> = ({ handleInstall, closePrompt }) => {
  const { t } = useTranslation();
  return (
    <Modal mask={false}>
      <div className="relative pointer-events-auto mt-4 w-[406px] p-4 rounded-md bg-white dark:bg-gray-900 shadow-md flex flex-col gap-3">
        <IconClose className="absolute top-4 right-4 cursor-pointer" onClick={closePrompt} />
        <div className="flex flex-col gap-4 text-gray-600 dark:text-gray-300">
          <h2 className="font-semibold">{t("tip.pwa_install_title")}</h2>
          <p className="text-sm">{t("tip.pwa_install_desc")}</p>
        </div>
        <div className="w-full flex justify-end gap-4">
          <Button className="ghost cancel small" onClick={closePrompt}>
            {t("action.cancel")}
          </Button>
          <Button className="main small" onClick={handleInstall}>
            {t("action.install")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Prompt;
