import { describe, it, expect } from 'vitest'
import Vue from 'vue'
import installPlugin, {
  getDialogManager,
  getToastManager,
  getPopupMenuManager,
  DialogManager,
  ToastManager,
  PopupMenuManager,
} from '../install'

describe('install plugin', () => {
  Vue.use(installPlugin)

  it('registers $dialog on Vue.prototype', () => {
    expect(Vue.prototype.$dialog).toBeDefined()
  })

  it('registers $toast on Vue.prototype', () => {
    expect(Vue.prototype.$toast).toBeDefined()
  })

  it('registers $popupMenu on Vue.prototype', () => {
    expect(Vue.prototype.$popupMenu).toBeDefined()
  })

  it('$dialog has open and closeAll methods', () => {
    expect(typeof Vue.prototype.$dialog.open).toBe('function')
    expect(typeof Vue.prototype.$dialog.closeAll).toBe('function')
  })

  it('$toast has show and closeAll methods', () => {
    expect(typeof Vue.prototype.$toast.show).toBe('function')
    expect(typeof Vue.prototype.$toast.closeAll).toBe('function')
  })

  it('$popupMenu has show method', () => {
    expect(typeof Vue.prototype.$popupMenu.show).toBe('function')
  })

  it('getDialogManager returns the same instance as $dialog', () => {
    expect(getDialogManager()).toBe(Vue.prototype.$dialog)
  })

  it('getToastManager returns the same instance as $toast', () => {
    expect(getToastManager()).toBe(Vue.prototype.$toast)
  })

  it('getPopupMenuManager returns the same instance as $popupMenu', () => {
    expect(getPopupMenuManager()).toBe(Vue.prototype.$popupMenu)
  })

  it('exposes DialogManager class', () => {
    expect(typeof DialogManager).toBe('function')
    expect(DialogManager.name).toBe('DialogManager')
  })

  it('exposes ToastManager class', () => {
    expect(typeof ToastManager).toBe('function')
    expect(ToastManager.name).toBe('ToastManager')
  })

  it('exposes PopupMenuManager class', () => {
    expect(typeof PopupMenuManager).toBe('function')
    expect(PopupMenuManager.name).toBe('PopupMenuManager')
  })

  it('managers are singletons', () => {
    const d1 = getDialogManager()
    const d2 = getDialogManager()
    expect(d1).toBe(d2)
  })
})
