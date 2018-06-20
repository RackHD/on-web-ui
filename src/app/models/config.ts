/*
 This defines the data model of RackHD configures.
*/
export class Config {
  key: string;
  value: string;
}

export const CONFIG_URL = {
    getAllUrl: '/config',
    patchUrl: '/config',
};
