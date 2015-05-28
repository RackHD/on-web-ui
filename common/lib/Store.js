'use strict';

import { EventEmitter } from 'events';

export default class Store extends EventEmitter {

  collection = {};

     list() { throw new Error('Store: Unimplemented list method.'); }
     read() { throw new Error('Store: Unimplemented read method.'); }
   create() { throw new Error('Store: Unimplemented create method.'); }
   update() { throw new Error('Store: Unimplemented update method.'); }
  destroy() { throw new Error('Store: Unimplemented destroy method.'); }

  all() {
    return Object.keys(this.collection)
      .map(id => this.collection[id])
      .filter(item => !!item);
  }

  get(id) {
    return this.collection[id];
  }

  error(id, error) {
    console.error('Store:', id, error.stack || error);
    this.emit(this.event(id, 'error'), error);
  }

  reset() {
    this.empty();
    this.removeAllListeners('change');
    this.removeAllListeners('error');
  }

  isEmpty() {
    for (var p in this.collection) {
      if (this.collection.hasOwnProperty(p)) { return false; }
    }
    return true;
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
    data = data || data;
    data.id = data.id || id;
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

  watchOne(id, prop, component, onError) {
    var listener = () => component.setState({[prop]: this.get(id)});
    this.subscribe(id, listener, onError);
    return this.unsubscribe.bind(this, id, listener, onError);
  }

  watchAll(prop, component, onError) {
    var listener = () => component.setState({[prop]: this.all()});
    this.subscribe(null, listener, onError);
    return this.unsubscribe.bind(this, null, listener, onError);
  }

  event(id, event='change') { return id ? event + ':' + id : event; }

  subscribeOnce(id, success, failure) {
    this.once(this.event(id), success);
    if (failure) {
      this.once(this.event(id, 'error'), failure);
    }
    else {
      console.warn(new Error('Store subscribed once to change without error handler.').stack);
    }
  }

  subscribe(id, success, failure) {
    this.on(this.event(id), success);
    if (failure) {
      this.on(this.event(id, 'error'), failure);
    }
    else {
      console.warn(new Error('Store subscribed to change without error handler.').stack);
    }
  }

  unsubscribe(id, success, failure) {
    this.removeListener(this.event(id), success);
    if (failure) {
      this.removeListener(this.event(id, 'error'), failure);
    }
  }

}
