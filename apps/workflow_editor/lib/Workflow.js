'use strict';

export default class Workflow {

  constructor(data) {
    Object.keys(data).forEach(prop => this[prop] = data[prop]);
  }

}
