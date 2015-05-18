'use strict';

import featureFlag from '../../common/lib/featureFlag';

// export const API = 'http://onrackapi.hwimo.lab.emc.com/rest/v1/';
export const API = 'http://localhost:2000/';

export const devFlag = featureFlag('dev').on();
