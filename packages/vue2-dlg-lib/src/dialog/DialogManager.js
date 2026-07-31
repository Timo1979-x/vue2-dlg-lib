import Vue from 'vue';
import DialogWindow from './DialogWindow.vue';

const BASE_Z_INDEX = 2000;
const Z_INDEX_STEP = 10;

export default class DialogManager {
  constructor(options = {}) {
    this.Vue = options.Vue || Vue;
    this.stack = [];
    this.container = null;
    this._onGlobalKeydown = null;
  }

  _ensureContainer() {
    if (this.container) return;
    this.container = document.createElement('div');
    this.container.className = 'vdl-dialog-manager';
    document.body.appendChild(this.container);

    this._onGlobalKeydown = (e) => {
      if (e.key === 'Escape' && this.stack.length > 0) {
        const topDialog = this.stack[this.stack.length - 1];
        if (topDialog) {
          topDialog.reject('escape');
        }
      }
    };
    document.addEventListener('keydown', this._onGlobalKeydown);
  }

  _getZIndex() {
    return BASE_Z_INDEX + this.stack.length * Z_INDEX_STEP;
  }

  _updateZIndexes() {
    this.stack.forEach((entry, index) => {
      entry.zIndex = BASE_Z_INDEX + index * Z_INDEX_STEP;
    });
  }

  _bringToFront(entry) {
    const idx = this.stack.indexOf(entry);
    if (idx === -1 || idx === this.stack.length - 1) return;
    this.stack.splice(idx, 1);
    this.stack.push(entry);
    this._updateZIndexes();
  }

  open(options = {}) {
    this._ensureContainer();

    const {
      title = '',
      width = '480px',
      height = '360px',
      minWidth,
      minHeight,
      contentComponent = null,
      contentProps = {},
      closeOnClickOutside = true,
      resizable = true,
      draggable = true,
      footer = null,
    } = options;

    return new Promise((resolve, reject) => {
      const zIndex = this._getZIndex();

      const entry = {
        resolve: null,
        reject: null,
        vm: null,
        zIndex,
      };

      entry.resolve = (data) => {
        if (entry.vm) {
          entry.vm.$destroy();
          entry.vm.$el.remove();
        }
        const idx = this.stack.indexOf(entry);
        if (idx !== -1) {
          this.stack.splice(idx, 1);
        }
        this._updateZIndexes();
        resolve(data);
      };

      entry.reject = (reason) => {
        if (entry.vm) {
          entry.vm.$destroy();
          entry.vm.$el.remove();
        }
        const idx = this.stack.indexOf(entry);
        if (idx !== -1) {
          this.stack.splice(idx, 1);
        }
        this._updateZIndexes();
        reject(reason);
      };

      const DialogConstructor = this.Vue.extend(DialogWindow);
      const vm = new DialogConstructor({
        propsData: {
          title,
          width,
          height,
          minWidth,
          minHeight,
          contentComponent,
          contentProps,
          closeOnClickOutside,
          resizable,
          draggable,
          zIndex,
        },
      });

      if (typeof footer === 'function') {
        const footerVnodes = footer(vm.$createElement, {
          resolve: entry.resolve,
          reject: entry.reject,
        });
        vm.$slots.footer = footerVnodes
          ? (Array.isArray(footerVnodes) ? footerVnodes : [footerVnodes])
          : [];
      }

      vm.$on('resolve', entry.resolve);
      vm.$on('reject', entry.reject);
      vm.$on('bring-to-front', () => {
        this._bringToFront(entry);
      });

      vm.$mount();
      this.container.appendChild(vm.$el);

      entry.vm = vm;
      this.stack.push(entry);
    });
  }

  closeAll() {
    const promises = this.stack.map((entry) => {
      return new Promise((resolve) => {
        if (entry.vm) {
          entry.vm.$destroy();
          entry.vm.$el.remove();
        }
        resolve();
      });
    });
    this.stack = [];
    return Promise.all(promises);
  }

  get size() {
    return this.stack.length;
  }

  destroy() {
    if (this._onGlobalKeydown) {
      document.removeEventListener('keydown', this._onGlobalKeydown);
      this._onGlobalKeydown = null;
    }
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
    this.stack = [];
  }
}
