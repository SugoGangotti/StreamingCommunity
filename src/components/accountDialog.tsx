/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import type { SettingType } from "@/types/SettingsType";

const AccountDialog = ({
  setting,
  value,
  updateSetting,
}: {
  setting: SettingType;
  value: any;
  updateSetting: (id: string, value: any) => void;
}) => {
  const [username, setUsername] = useState(
    value?.username || setting.default.username || "",
  );
  const [password, setPassword] = useState(
    value?.password || setting.default.password || "",
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Configura</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle>
            Inserisci le credenziali per {setting.label}
          </DialogTitle>
          <DialogDescription>{setting.description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${setting.id}-username`}>Username</Label>
            <Input
              id={`${setting.id}-username`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={setting.default.username || ""}
              minLength={4}
              maxLength={20}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`${setting.id}-password`}>Password</Label>
            <Input
              id={`${setting.id}-password`}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={setting.default.password || ""}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-row gap-3">
          <Button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              updateSetting(setting.id, { username, password });
            }}
          >
            Salva
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccountDialog;
