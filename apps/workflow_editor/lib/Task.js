'use strict';

export default class Task {

  constructor(data) {
    Object.keys(data).forEach(prop => this[prop] = data[prop]);
  }

}
