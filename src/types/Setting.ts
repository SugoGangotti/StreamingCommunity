/* eslint-disable @typescript-eslint/no-explicit-any */

export type Setting = {
  id: string;
  label: string;
  type: string;
  default: any;
  description?: string;
  [key: string]: any;
};
