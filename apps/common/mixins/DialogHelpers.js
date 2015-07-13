'use strict';

import ConfirmDialog from '../views/dialogs/Confirm';

export default {

  confirmDialog(message, callback) {
    var confirmProps = {
      callback: callback,
      children: message,
      title: 'Confirm:'
    };
    ConfirmDialog.create(confirmProps);
  }

};
