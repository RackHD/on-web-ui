'use strict';

import { EventEmitter } from 'events';

export default class Store extends EventEmitter {

  collection = {};

  all() {
    return Object.keys(this.collection)
      .map(id => this.collection[id])
      .filter(item => !!item);
  }

  get(id) {
    return this.collection[id];
  }

  error(id, error) {
    this.emit(this.event(id, 'error'), error);
  }

  reset() {
    this.empty();
    this.removeAllListeners('change');
    this.removeAllListeners('error');
  }

  empty() {
    Object.keys(this.collection).forEach(id => this.remove(id));
    this.publish();
  }

  collect(list) {
    list.forEach(item => this.insert(item.id, item));
  }

  publish(id) {
    if (id) { this.emit('change:' + id); }
    this.emit('change');
  }

  insert(id, data) {
    if (!id) { return; }
    this.collection[id] = data;
    this.publish(id);
  }

  change(id, data) {
    this.insert(id, data);
  }

  remove(id) {
    if (!id) { return; }
    this.insert(id, null);
    this.removeAllListeners(this.event(id));
    this.removeAllListeners(this.event(id, 'error'));
  }

  event(id, event='change') { return id ? event + ':' + id : event; }

  subscribeOnce(id, success, failure) {
    this.once(this.event(id), success);
    this.once(this.event(id, 'error'), failure);
  }

  subscribe(id, success, failure) {
    this.on(this.event(id), success);
    this.on(this.event(id, 'error'), failure);
  }

  unsubscribe(id, success, failure) {
    this.removeListener(this.event(id), success);
    this.removeListener(this.event(id, 'error'), failure);
  }

}
