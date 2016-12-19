// Copyright 2015, EMC, Inc.

import Store from 'src-common/lib/Store';

import RackHDRestAPIv2_0 from '../messengers/RackHDRestAPIv2_0';

export default class ProfileStore extends Store {

  api = RackHDRestAPIv2_0.url;
  resource = 'profiles';

  list() {
    return RackHDRestAPIv2_0.api.profilesGetMetadata()
      .then(res => this.recollect(res.obj))
      .catch(err => this.error(null, err));
  }

  read(name) {
    return RackHDRestAPIv2_0.api.profilesGetLibByName({ name })
      .then(res => this.change(name, res.obj))
      .catch(err => this.error(name, err));
  }

  create(name, data) {
    return RackHDRestAPIv2_0.api.profilesPutLibByName({name, content: data })
      .then(() => this.insert(name, data))
      .catch(err => this.error(name, err));
  }

  update(id, data) {
    return RackHDRestAPIv2_0.api.profilesPutLibByName({name, content: data })
      .then(() => this.insert(name, data))
      .catch(err => this.error(name, err));
  }

}
