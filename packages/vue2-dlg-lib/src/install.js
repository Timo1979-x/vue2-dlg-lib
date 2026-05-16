import DialogManager from './dialog/DialogManager';
import ToastManager from './toast/ToastManager';
import PopupMenuManager from './popup-menu/popupMenu';

let dialogManager = null;
let toastManager = null;
let popupMenuManager = null;

export function getDialogManager() {
  return dialogManager;
}

export function getToastManager() {
  return toastManager;
}

export function getPopupMenuManager() {
  return popupMenuManager;
}

export default {
  install(Vue) {
    if (!dialogManager) {
      dialogManager = new DialogManager({ Vue });
    }
    if (!toastManager) {
      toastManager = new ToastManager({ Vue });
    }
    if (!popupMenuManager) {
      popupMenuManager = new PopupMenuManager({ Vue });
    }

    Vue.prototype.$dialog = dialogManager;
    Vue.prototype.$toast = toastManager;
    Vue.prototype.$popupMenu = popupMenuManager;
  },
};

export { DialogManager, ToastManager, PopupMenuManager };
