'use strict';

import Store from 'common-web-ui/lib/Store';

import ChassisAPI from '../api/ManagedSystems/ChassisAPI';

export default class ChassisStore extends Store {

  list() {
    this.empty();
    var self = this;
    function map(list) {
      return list.Links.Members.map(member => {
        var id = member.href.split('/').pop();
        setTimeout(self.read.bind(self, id), 0);
        return { id };
      });
    }
    return ChassisAPI.getChassisCollection()
      .then(list => this.collect(map(list)))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return ChassisAPI.getChassis(id)
      .then(item => this.change(id, {
        url: item.id, // Why is this a url?
        id: item.Id,
        sku: item.sku,
        status: item.Status && {
          healthRollUp: item.Status.HealthRollUp,
          state: item.Status.State,
          health: item.Status.Health
        },
        name: item.Name,
        partNumber: item.partNumber,
        assetTag: item.assetTag,
        computeSystems: item.Links && item.Links.ComputeSystem &&
                        item.Links.ComputeSystem.map(system => system.href.split('/').pop()),
        serialNumber: item.SerialNumber,
        modified: item.Modified,
        indicatorLED: item.IndicatorLED,
        version: item.Version,
        oem: item.Oem,
        context: item.context,
        chassisType: item.ChassisType,
        model: item.Model,
        manufacturer: item.Manufacturer,
        type: item.type,
        description: item.Description
      }))
      .catch(err => this.error(id, err));
  }

}
