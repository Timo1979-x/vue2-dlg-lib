import Vue from 'vue';
import PopupMenu from './PopupMenu.vue';

const BASE_Z_INDEX = 2500;
const Z_INDEX_STEP = 10;

export default class PopupMenuManager {
  constructor(options = {}) {
    this.Vue = options.Vue || Vue;
    this.activeMenus = [];
    this.container = null;
  }

  _ensureContainer() {
    if (this.container) return;
    this.container = document.createElement('div');
    this.container.className = 'vdl-popup-menu-manager';
    document.body.appendChild(this.container);
  }

  _getZIndex() {
    return BASE_Z_INDEX + this.activeMenus.length * Z_INDEX_STEP;
  }

  show(options = {}) {
    this._ensureContainer();

    const {
      items = [],
      x = 0,
      y = 0,
    } = options;

    return new Promise((resolve, reject) => {
      const zIndex = this._getZIndex();
      let isResolved = false;

      const MenuConstructor = this.Vue.extend(PopupMenu);
      const vm = new MenuConstructor({
        propsData: {
          items,
          x,
          y,
          zIndex,
        },
      });

      const cleanup = () => {
        const idx = this.activeMenus.indexOf(entry);
        if (idx !== -1) {
          this.activeMenus.splice(idx, 1);
        }
        if (vm) {
          vm.$destroy();
          if (vm.$el && vm.$el.parentNode) {
            vm.$el.parentNode.removeChild(vm.$el);
          }
        }
      };

      const entry = {
        vm,
        resolve: (data) => {
          if (isResolved) return;
          isResolved = true;
          cleanup();
          resolve(data);
        },
        reject: (reason) => {
          if (isResolved) return;
          isResolved = true;
          cleanup();
          reject(reason);
        },
      };

      vm.$on('resolve', entry.resolve);
      vm.$on('reject', entry.reject);

      vm.$mount();
      this.container.appendChild(vm.$el);

      this.activeMenus.push(entry);
    });
  }

  closeAll() {
    this.activeMenus.forEach((entry) => {
      entry.reject('closed all');
    });
  }

  destroy() {
    this.closeAll();
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
    this.activeMenus = [];
  }
}
