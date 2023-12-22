import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { useUpdateLogoMutation, useUpdateServerMutation } from "@/app/services/server";
import { useAppSelector } from "@/app/store";
import LogoUploader from "@/components/AvatarUploader";
import SaveTip from "@/components/SaveTip";
import Input from "@/components/styled/Input";
import Label from "@/components/styled/Label";
import Textarea from "@/components/styled/Textarea";
import { shallowEqual } from "react-redux";

const Index = () => {
  const { t } = useTranslation("setting");
  const { t: ct } = useTranslation();
  const isAdmin = useAppSelector((store) => store.authData.user?.is_admin, shallowEqual);
  const server = useAppSelector((store) => store.server, shallowEqual);

  const [uploadLogo, { isSuccess: uploadSuccess }] = useUpdateLogoMutation();
  const [updateServer] = useUpdateServerMutation();
  const [changed, setChanged] = useState(false);
  const [serverValues, setServerValues] = useState<typeof server>(server);
  const handleChange = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = evt.target.value;
    const { type = "" } = evt.target.dataset;
    setServerValues((prev) => {
      return { ...prev, [type]: newValue };
    });
  };
  const handleUpdateServer = () => {
    const { name, description } = serverValues;
    updateServer({ name, description });
  };

  const handleReset = () => {
    setServerValues(server);
  };
  useEffect(() => {
    if (server) {
      setServerValues(server);
    }
  }, [server]);
  useEffect(() => {
    if (uploadSuccess) {
      toast.success(ct("tip.update"));
    }
  }, [uploadSuccess]);
  useEffect(() => {
    if (server && serverValues) {
      const { name, description } = serverValues;
      const { name: oName, description: oDescription } = server;
      if (oName !== name || oDescription !== description) {
        setChanged(true);
      } else {
        setChanged(false);
      }
    }
  }, [server, serverValues]);
  const { name, description, logo } = serverValues;
  if (!serverValues) return null;
  return (
    <>
      <div className="flex gap-4">
        <div className="w-24 h-24">
          <LogoUploader
            disabled={!isAdmin}
            url={uploadSuccess ? `${logo}?t=${+new Date()}` : logo}
            name={name}
            uploadImage={uploadLogo}
          />
        </div>
        {isAdmin && (
          <div className="flex flex-col justify-between items-start">
            <div className="text-sm text-gray-600 dark:text-gray-100">
              {t("overview.upload_desc")}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col items-start gap-6 mb-3">
        <div className="w-full flex flex-col items-start gap-2">
          <Label htmlFor="name">{t("overview.name")}</Label>
          <Input
            disabled={!isAdmin}
            data-type="name"
            onChange={handleChange}
            value={name}
            name="name"
            id="name"
            placeholder="Server Name"
          />
        </div>
        <div className="w-full flex flex-col items-start gap-2">
          <Label htmlFor="desc">{t("overview.desc")}</Label>
          <Textarea
            disabled={!isAdmin}
            data-type="description"
            onChange={handleChange}
            value={description ?? ""}
            rows={4}
            name="desc"
            id="desc"
            placeholder="Tell the world a bit about this server"
          />
        </div>
      </div>
      {changed && <SaveTip saveHandler={handleUpdateServer} resetHandler={handleReset} />}
    </>
  );
};

export default Index;
