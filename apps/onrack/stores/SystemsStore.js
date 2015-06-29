'use strict';

import Store from 'common-web-ui/lib/Store';

import SystemsAPI from '../messengers/SystemsAPI';

export default class SystemsStore extends Store {

  list() {
    this.empty();
    var self = this;
    function map(list) {
      return list.Links.Members.map(member => {
        var url = member.href.split('/'),
            id = url.pop();
        if (!id) { id = url.pop(); }
        setTimeout(self.read.bind(self, id), 0);
        return { id };
      });
    }
    return SystemsAPI.getSystemsCollection()
      .then(list => this.collect(map(list)))
      .catch(err => this.error(null, err));
  }

  read(id) {
    return SystemsAPI.getSystem(id)
      .then(item => this.change(id, {
        url: item.id, // Why is this a url?
        id: item.Id,
        sku: item.sku,
        processors: item.Processors && {
          count: item.Processors.Count,
          status: item.Processors.Status && {
            healthRollUp: item.Processors.Status.HealthRollUp,
            state: item.Processors.Status.State,
            health: item.Processors.Status.Health
          },
          processorFamily: item.Processors.ProcessorFamily
        },
        status: item.Status && {
          healthRollUp: item.Status.HealthRollUp,
          state: item.Status.State,
          health: item.Status.Health
        },
        actions: item.Actions, // TODO: map this
        name: item.Name,
        partNumber: item.partNumber,
        assetTag: item.assetTag,
        chassis: item.Links && item.Links.Chassis &&
                 item.Links.Chassis.map(chassis => chassis.href.split('/').pop()),
        // TODO: item.Links.Oem
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
