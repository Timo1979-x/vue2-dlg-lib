import Vue from 'vue';
import Toast from './Toast.vue';

export default class ToastManager {
  constructor(options = {}) {
    this.Vue = options.Vue || Vue;
    this.toasts = [];
    this.container = null;
    this._onGlobalKeydown = null;
  }

  _ensureContainer() {
    if (this.container) return;
    this.container = document.createElement('div');
    this.container.className = 'vdl-toast-manager';
    this.container.style.cssText = `
      position: fixed;
      top: 16px;
      right: 20px;
      z-index: 3000;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    `;
    document.body.appendChild(this.container);

    this._onGlobalKeydown = (e) => {
      if (e.key === 'Escape' && this.toasts.length > 0) {
        this.closeAll();
      }
    };
    document.addEventListener('keydown', this._onGlobalKeydown);
  }

  _positionToasts() {
    this.toasts.forEach((entry, index) => {
      entry.index = index;
      if (entry.vm && entry.vm.$el) {
        entry.vm.$el.style.pointerEvents = 'auto';
      }
    });
  }

  show(options = {}) {
    this._ensureContainer();

    const {
      message = '',
      duration = 5000,
      type = 'default',
    } = options;

    const entry = {
      vm: null,
      index: this.toasts.length,
    };

    const ToastConstructor = this.Vue.extend(Toast);
    const vm = new ToastConstructor({
      propsData: {
        message,
        duration: duration || 0,
        type,
        index: entry.index,
      },
    });

    vm.$on('close', () => {
      this._remove(entry);
    });

    vm.$mount();
    this.container.appendChild(vm.$el);

    entry.vm = vm;
    this.toasts.push(entry);
    this._positionToasts();

    return entry;
  }

  closeAll() {
    const toastsCopy = [...this.toasts];
    toastsCopy.forEach((entry) => {
      if (entry.vm) {
        entry.vm.close();
      }
    });
  }

  _remove(entry) {
    const idx = this.toasts.indexOf(entry);
    if (idx === -1) return;
    this.toasts.splice(idx, 1);
    if (entry.vm) {
      entry.vm.$destroy();
      if (entry.vm.$el && entry.vm.$el.parentNode) {
        entry.vm.$el.parentNode.removeChild(entry.vm.$el);
      }
    }
    this._positionToasts();
  }

  get size() {
    return this.toasts.length;
  }

  destroy() {
    if (this._onGlobalKeydown) {
      document.removeEventListener('keydown', this._onGlobalKeydown);
      this._onGlobalKeydown = null;
    }
    this.closeAll();
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
    this.toasts = [];
  }
}
