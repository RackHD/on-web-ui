// Copyright 2015, EMC, Inc.

import url from 'url';
import { EventEmitter } from 'events';

import config from 'src-config';
import Messenger from './Messenger';

export default class Store extends EventEmitter {

  static cache = {};

  static emptyCache() {
    this.cache = {};
  }

  static loadCache() {
    let jsonCache = window.localStorage.getItem(this.name + '-cache') || '{}';
    try { this.cache = JSON.parse(jsonCache); } catch (err) {}
  }

  static saveCache() {
    let jsonCache = JSON.stringify(this.cache);
    window.localStorage.setItem(this.name + '-cache', jsonCache);
  }

  autoCache = false;
  onChange = null;

  constructor(EntityClass, autoCache, onChange) {
    super();
    this.EntityClass = EntityClass || this.EntityClass;
    this.autoCache = autoCache || this.autoCache;
    this.collection = {};
    if (this.autoCache) { this.loadCache(); }
  }

  get cache() {
    return this.constructor.cache;
  }

  emptyCache() {
    this.constructor.emptyCache();
  }

  loadCache() {
    this.constructor.loadCache();
  }

  saveCache() {
    this.constructor.saveCache();
  }

  startMessenger(resource, host, secure) {
    if (this.messenger) {
      return console.error(new Error('A messenger already exists.').stack);
    }
    resource = resource || this.resource;
    host = host || config.RackHD_WSS;
    secure = secure || config.check('Enable_RackHD_SSL');
    this.messenger = new Messenger(resource, host, secure);
    this.messenger.connect(() => {
      if (!this.messenger) {
        return console.warn(new Error('A messenger connected after it was stopped.').stack);
      }
      this.messenger.on('message', msg => {
        if (msg.handler === 'item') {
          if (msg.id[0] === 'created') {
            this.insert(msg.id[1], msg.data);
          }
          else if (msg.id[0] === 'updated') {
            this.change(msg.id[1], msg.data);
          }
        }
        if (msg.handler === 'remove') {
          this.remove(msg.id);
        }
      });
      this.messenger.watch();
    });
  }

  stopMessenger() {
    if (!this.messenger) {
      return;
    }
    this.messenger.stop(null, null);
    this.messenger.disconnect();
    delete this.messenger;
  }

  list() { throw new Error('Store: Unimplemented list method.'); }
  read() { throw new Error('Store: Unimplemented read method.'); }
  create() { throw new Error('Store: Unimplemented create method.'); }
  update() { throw new Error('Store: Unimplemented update method.'); }
  destroy() { throw new Error('Store: Unimplemented destroy method.'); }

  all(collection = this.collection) {
    return Object.keys(collection)
      .map(id => collection[id])
      .filter(item => !!item)
      .concat(collection === this.cache ? this.all(this.cache) : []);
  }

  each(iterator) {
    Object.keys(this.collection).forEach(id => iterator(this.get(id), id, this.collection));
  }

  get(id) {
    return this.collection[id] || this.cache[id];
  }

  error(id, error) {
    this.emit(this.event(id, 'error'), error);
    console.error('Store Error:', this.constructor.name, id, error.stack || error);
    if (window.onerror) window.onerror(error.message);
  }

  reset() {
    this.empty();
    this.removeAllListeners('change');
    this.removeAllListeners('error');
  }

  isEmpty() {
    for (let p in this.collection) {
      if (this.collection.hasOwnProperty(p)) { return false; }
    }
    return true;
  }

  empty(silent) {
    Object.keys(this.collection).forEach(id => this.remove(id));
    if (!silent) { this.publish(); }
  }

  key = 'id';

  collect(list, silent) {
    list.forEach(item => this.insert(item[this.key], item, true));
    if (!silent) { this.publish(); }
  }

  recollect(list, silent) {
    this.empty(true);
    if (this.autoCache) { this.emptyCache(); }
    this.collect(list, silent);
  }

  publish(id) {
    if (id) { this.emit('change:' + id, id); }
    if (this.onChange) { this.onChange(id); }
    this.emit('change', id);
  }

  insert(id, data, silent) {
    if (!id) { throw new Error('Store: Unable to insert data without an id.'); }
    if (data === undefined) {
      console.warn(new Error('Store: Insert called with undefined data.'));
      data = this.collection[id];
    }
    let object = this.EntityClass && data ? new this.EntityClass(data) : data;
    this.collection[id] = object;
    this.cache[id] = data;
    if (!silent) { this.publish(id); }
    if (this.autoCache) {
      clearTimeout(this.autoCacheTimer);
      this.autoCacheTimer = setTimeout(this.saveCache.bind(this), 10);
    }
  }

  assign(id, newData, oldData) {
    this.insert(id, Object.assign(oldData || this.get(id) || {}, newData));
  }

  change(id, data, silent) {
    this.insert(id, data, silent);
  }

  remove(id, silent) {
    if (!id) { return; }
    this.insert(id, null, silent);
    this.removeAllListeners(this.event(id));
    this.removeAllListeners(this.event(id, 'error'));
  }

  watchOne(id, prop, component, onError) {
    let listener = () => component.setState({
      [prop]: Array.isArray(id) ? id.map(id => this.get(id)) : this.get(id)
    });
    listener();
    this.subscribe(id, listener, onError);
    return this.unsubscribe.bind(this, id, listener, onError);
  }

  watchAll(prop, component, onError) {
    let listener = () => component.setState({[prop]: this.all()});
    listener();
    this.subscribe(null, listener, onError);
    return this.unsubscribe.bind(this, null, listener, onError);
  }

  event(id, event='change') { return id ? event + ':' + id : event; }

  subscribeOnce(id, success, failure) {
    this.once(this.event(id), success);
    if (failure) {
      this.once(this.event(id, 'error'), failure);
    }
  }

  subscribe(id, success, failure) {
    this.on(this.event(id), success);
    if (failure) {
      this.on(this.event(id, 'error'), failure);
    }
  }

  unsubscribe(id, success, failure) {
    this.removeListener(this.event(id), success);
    if (failure) {
      this.removeListener(this.event(id, 'error'), failure);
    }
  }

}
