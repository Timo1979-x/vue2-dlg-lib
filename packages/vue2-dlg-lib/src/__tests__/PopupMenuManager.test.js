import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import Vue from 'vue'
import PopupMenuManager from '../popup-menu/popupMenu'

describe('PopupMenuManager', () => {
  let manager
  const pending = []

  function showItems() {
    const p = manager.show({
      items: [{ text: 'Item', value: '1' }],
      x: 100,
      y: 200,
    })
    pending.push(p)
    return p
  }

  beforeEach(() => {
    manager = new PopupMenuManager({ Vue })
  })

  afterEach(() => {
    manager.destroy()
    // Suppress unhandled rejections from pending promises destroyed by cleanup
    pending.splice(0).forEach((p) => p.catch(() => {}))
  })

  it('creates container on first show', () => {
    showItems()
    const container = document.querySelector('.vdl-popup-menu-manager')
    expect(container).toBeTruthy()
  })

  it('returns a promise from show()', () => {
    const p = showItems()
    expect(p).toBeInstanceOf(Promise)
  })

  it('resolve on item selection', async () => {
    const p = manager.show({
      items: [
        { text: 'Open', value: 'open' },
        { text: 'Save', value: 'save' },
      ],
      x: 100,
      y: 200,
    })
    expect(manager.activeMenus.length).toBe(1)
    manager.activeMenus[0].resolve({ text: 'Open', value: 'open' })
    await expect(p).resolves.toEqual({ text: 'Open', value: 'open' })
    expect(manager.activeMenus.length).toBe(0)
  })

  it('reject closes the menu', async () => {
    const p = manager.show({
      items: [{ text: 'Open', value: 'open' }],
      x: 100,
      y: 200,
    })
    manager.activeMenus[0].reject('escaped')
    await expect(p).rejects.toBe('escaped')
    expect(manager.activeMenus.length).toBe(0)
  })

  it('closeAll rejects all active menus', async () => {
    const p1 = manager.show({
      items: [{ text: 'A', value: 'a' }],
      x: 0,
      y: 0,
    })
    const p2 = manager.show({
      items: [{ text: 'B', value: 'b' }],
      x: 0,
      y: 0,
    })
    expect(manager.activeMenus.length).toBe(2)
    manager.closeAll()
    expect(manager.activeMenus.length).toBe(0)
    await expect(p1).rejects.toBe('closed all')
    await expect(p2).rejects.toBe('closed all')
  })

  it('destroy cleans up all menus', () => {
    const p = manager.show({
      items: [{ text: 'A', value: 'a' }],
      x: 0,
      y: 0,
    })
    p.catch(() => {})
    manager.destroy()
    expect(document.querySelector('.vdl-popup-menu-manager')).toBeNull()
    expect(manager.activeMenus.length).toBe(0)
  })

  it('assigns increasing z-index values (base 2500, step 10)', () => {
    const p1 = manager.show({
      items: [{ text: 'first', value: '1' }],
      x: 0,
      y: 0,
    })
    expect(manager.activeMenus[0].vm.zIndex).toBe(2500)
    const p2 = manager.show({
      items: [{ text: 'second', value: '2' }],
      x: 0,
      y: 0,
    })
    expect(manager.activeMenus[1].vm.zIndex).toBe(2510)
    p1.catch(() => {})
    p2.catch(() => {})
  })
})
