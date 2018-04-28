/*
 This defines the data model of Node's OBM.
 */
export class OBM {
  id: string;
  node: string;
  service: string;
  config: {};
}

export const OBM_URL = {
  getAllUrl: '/obms',
  getByIdentifierUrl: '/obms/',
}

// https://github.com/RackHD/on-http/blob/master/lib/services/obm-api-service.js
export const OBM_TYPES = {
  'amt-obm-service': {
    service: 'amt-obm-service',
    config: {
      host: {
        default: 'localhost',
        type: 'string'
      },
      password: {
        default: 'admin',
        type: 'string'
      }
    }
  },
  'apc-obm-service': {
    service: 'apc-obm-service',
    config: {
      host: {
        default: 'localhost',
        type: 'string'
      },
      community: {
        default: 'admin',
        type: 'string'
      },
      port: {
        default: 1,
        type: 'integer'
      }
    }
  },
  'dell-wsman-obm-service': {
    service: 'dell-wsman-obm-service',
    config: {
      host: {
        default: 'localhost',
        type: 'string'
      },
      user: {
        default: 'root',
        type: 'string'
      },
      password: {
        default: 'calvin',
        type: 'string'
      }
    }
  },
  'ipmi-obm-service': {
    service: 'ipmi-obm-service',
    config: {
      host: {
        default: 'localhost',
        type: 'string'
      },
      user: {
        default: 'admin',
        type: 'string'
      },
      password: {
        default: 'admin',
        type: 'string'
      }
    }
  },
  // 'noop-obm-service': {
  // service: 'noop-obm-service',
  // config: {}
  // },
  'raritan-obm-service': {
    service: 'raritan-obm-service',
    config: {
      host: {
        default: 'localhost',
        type: 'string'
      },
      user: {
        default: 'admin',
        type: 'string'
      },
      password: {
        default: 'admin',
        type: 'string'
      },
      port: {
        default: 1,
        type: 'integer'
      }
    }
  },
  'servertech-obm-service': {
    service: 'servertech-obm-service',
    config: {
      host: {
        default: 'localhost',
        type: 'string'
      },
      community: {
        default: 'admin',
        type: 'string'
      },
      port: {
        default: 1,
        type: 'integer'
      }
    }
  },
  'snmp-obm-service': {
    service: 'snmp-obm-servic',
    config: {
      host: {
        default: 'localhost',
        type: 'string'
      },
      community: {
        default: 'admin',
        type: 'string'
      }
    }
  },
  'panduit-obm-service': {
    service: 'panduit-obm-service',
    config: {
      host: {
        default: 'localhost',
        type: 'string'
      },
      community: {
        default: 'admin',
        type: 'string'
      },
      cyclePassword: {
        default: 'onrack',
        type: 'string'
      },
      pduOutlets: [
        {
          host: {
            default: 'localhost',
            type: 'string'
          },
          community: {
            default: 'admin',
            type: 'string'
          },
          cyclePassword: {
            default: 'A01',
            type: 'string'
          },
          pduNumber: {
            default: 1,
            type: 'integer'
          },
          outletNumber: {
            default: 1,
            type: 'integer'
          }
        },
        {
          host: {
            default: 'localhost',
            type: 'string'
          },
          community: {
            default: 'admin',
            type: 'string'
          },
          cyclePassword: {
            default: 'A01',
            type: 'string'
          },
          pduNumber: {
            default: 2,
            type: 'integer'
          },
          outletNumber: {
            default: 1,
            type: 'integer'
          }
        },
      ]
    }
  },
  'vbox-obm-service': {
    service: 'vbox-obm-service',
    config: {
      alias: {
        default: 'client',
        type: 'string'
      },
      user: {
        default: 'root',
        type: 'string'
      }
    }
  },
  'vmrun-obm-service': {
    service: 'vmrun-obm-service',
    config: {
      vmxpath: {
        default: '/tmp/vm.vmx',
        type: 'string'
      }
    }
  }
}
