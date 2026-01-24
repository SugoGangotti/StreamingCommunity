/* eslint-disable @typescript-eslint/no-explicit-any */

export type SettingType = {
  id: string;
  label: string;
  type: string;
  default: any;
  description?: string;
  [key: string]: any;
};
