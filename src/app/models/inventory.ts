/*
 This defines the data model of common inventory contants.
*/
import * as _ from 'lodash';

export const PAGE_SIZE_OPTIONS = [15, 20, 50, 100];

export class ModalTypes {
  detailActions: string [];
  alertActions: string [];
  formActions: string [];
  otherActions: string [];
  constructor(
    detailList = ["Detail", "Raw", "Meta"],
    alertList = ["Delete", "Cancel"],
    formList = ["Update", "Create", "Upload"],
    otherList = []
  ) {
    this.detailActions = detailList;
    this.alertActions = alertList;
    this.formActions = formList;
    this.otherActions = otherList;
  };
}
