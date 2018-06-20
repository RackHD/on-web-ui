import * as _ from 'lodash';

export class RackhdLocalStorage {
  constructor () {}

  static isSecured(): boolean {
    return window.localStorage.getItem('rackhd.connSecured') === 'true' ? true : false;
  }

  static getBaseUrl(): string {
    return (RackhdLocalStorage.isSecured() ? 'https://' : 'http://') +
      window.localStorage.getItem('rackhd.northboundApi');
  }

  static getToken(): string {
    return window.localStorage.getItem('rackhd.authToken');
  }
}
