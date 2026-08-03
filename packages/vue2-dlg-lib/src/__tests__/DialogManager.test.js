import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import Vue from 'vue'
import DialogManager from '../dialog/DialogManager'
import { FOOTER_BUTTONS } from '../dialog/footerButtons'

describe('DialogManager', () => {
  let manager

  beforeEach(() => {
    manager = new DialogManager({ Vue })
  })

  afterEach(() => {
    manager.destroy()
  })

  it('starts with empty stack', () => {
    expect(manager.size).toBe(0)
  })

  it('creates container element on first open', () => {
    manager.open({ title: 'test' })
    expect(document.querySelector('.vdl-dialog-manager')).toBeTruthy()
  })

  it('returns a promise from open()', () => {
    const p = manager.open({ title: 'test' })
    expect(p).toBeInstanceOf(Promise)
  })

  it('increments stack size on open', () => {
    manager.open({ title: 'one' })
    expect(manager.size).toBe(1)
  })

  it('decrements stack size on reject', async () => {
    const p = manager.open({ title: 'test' })
    expect(manager.size).toBe(1)
    manager.stack[manager.stack.length - 1].reject('cancelled')
    expect(manager.size).toBe(0)
    await expect(p).rejects.toBe('cancelled')
  })

  it('reject rejects the returned promise', async () => {
    const p = manager.open({ title: 'test' })
    manager.stack[0].reject('cancelled')
    await expect(p).rejects.toBe('cancelled')
  })

  it('resolve resolves the returned promise', async () => {
    const p = manager.open({ title: 'test' })
    const data = { id: 1 }
    manager.stack[0].resolve(data)
    await expect(p).resolves.toEqual(data)
  })

  it('closeAll clears the stack', async () => {
    manager.open({ title: '1' })
    manager.open({ title: '2' })
    manager.open({ title: '3' })
    expect(manager.size).toBe(3)
    await manager.closeAll()
    expect(manager.size).toBe(0)
  })

  it('assigns increasing z-index values (base 2000, step 10)', () => {
    manager.open({ title: 'first' })
    expect(manager.stack[0].zIndex).toBe(2000)
    manager.open({ title: 'second' })
    expect(manager.stack[1].zIndex).toBe(2010)
    manager.open({ title: 'third' })
    expect(manager.stack[2].zIndex).toBe(2020)
  })

  it('Escape key rejects the top dialog only', async () => {
    manager.open({ title: 'bottom' })
    const p2 = manager.open({ title: 'top' })
    expect(manager.size).toBe(2)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(manager.size).toBe(1)
    await expect(p2).rejects.toBe('escape')
  })

  it('Escape rejects each stacked dialog one at a time', async () => {
    const p1 = manager.open({ title: 'first' })
    const p2 = manager.open({ title: 'second' })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(manager.size).toBe(1)
    await expect(p2).rejects.toBe('escape')
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(manager.size).toBe(0)
    await expect(p1).rejects.toBe('escape')
  })

  it('destroy removes the container and keydown listener', () => {
    manager.open({ title: 'test' })
    manager.destroy()
    expect(document.querySelector('.vdl-dialog-manager')).toBeNull()
    expect(manager.size).toBe(0)
  })

  it('does not create container before open', () => {
    expect(document.querySelector('.vdl-dialog-manager')).toBeNull()
  })

  it('container has correct class name', () => {
    manager.open({ title: 'test' })
    const el = document.querySelector('.vdl-dialog-manager')
    expect(el).toBeTruthy()
    expect(el.tagName).toBe('DIV')
  })

  it('renders default footer with close button when no footerButtons option', () => {
    manager.open({ title: 'test' })
    const btn = document.querySelector('.vdl-dialog__footer .vdl-dialog__btn--primary')
    expect(btn).toBeTruthy()
    expect(btn.textContent.trim()).toBe('Закрыть')
  })

  it('renders standard footer buttons selected by bitmask', () => {
    manager.open({
      title: 'test',
      footerButtons: FOOTER_BUTTONS.OK | FOOTER_BUTTONS.CANCEL,
    })
    const buttons = Array.from(document.querySelectorAll('.vdl-dialog__footer .vdl-dialog__btn'))
    const labels = buttons.map((b) => b.textContent.trim())
    expect(labels).toEqual(['Ок', 'Отмена'])
  })

  it('renders all standard footer buttons when the full bitmask is passed', () => {
    manager.open({
      title: 'test',
      footerButtons: FOOTER_BUTTONS.OK | FOOTER_BUTTONS.YES | FOOTER_BUTTONS.NO | FOOTER_BUTTONS.CLOSE | FOOTER_BUTTONS.CANCEL,
    })
    const labels = Array.from(document.querySelectorAll('.vdl-dialog__footer .vdl-dialog__btn'))
      .map((b) => b.textContent.trim())
    expect(labels).toEqual(['Ок', 'Да', 'Нет', 'Закрыть', 'Отмена'])
  })

  it('renders no footer buttons when bitmask is 0', () => {
    manager.open({ title: 'test', footerButtons: 0 })
    expect(document.querySelector('.vdl-dialog__footer .vdl-dialog__btn')).toBeNull()
  })

  it('Ок button resolves the promise with its bitmask value', async () => {
    const p = manager.open({
      title: 'test',
      footerButtons: FOOTER_BUTTONS.OK | FOOTER_BUTTONS.CANCEL,
    })
    const buttons = Array.from(document.querySelectorAll('.vdl-dialog__footer .vdl-dialog__btn'))
    const ok = buttons.find((b) => b.textContent.trim() === 'Ок')
    ok.click()
    expect(manager.size).toBe(0)
    await expect(p).resolves.toBe(FOOTER_BUTTONS.OK)
  })

  it('Отмена button rejects the promise with its bitmask value', async () => {
    const p = manager.open({
      title: 'test',
      footerButtons: FOOTER_BUTTONS.OK | FOOTER_BUTTONS.CANCEL,
    })
    const buttons = Array.from(document.querySelectorAll('.vdl-dialog__footer .vdl-dialog__btn'))
    const cancel = buttons.find((b) => b.textContent.trim() === 'Отмена')
    cancel.click()
    expect(manager.size).toBe(0)
    await expect(p).rejects.toBe(FOOTER_BUTTONS.CANCEL)
  })

  it('default close button rejects the promise with CLOSE bitmask value', async () => {
    const p = manager.open({ title: 'test' })
    document.querySelector('.vdl-dialog__footer .vdl-dialog__btn--primary').click()
    expect(manager.size).toBe(0)
    await expect(p).rejects.toBe(FOOTER_BUTTONS.CLOSE)
  })

  it('renders footer buttons from the content component named slot', async () => {
    const Child = {
      template: `
        <div>
          <p>content</p>
          <template slot="footer">
            <button class="child-footer-ok" @click="handleOk">Ок</button>
          </template>
        </div>
      `,
      props: {
        dialogResolve: {
          type: Function,
          default: () => {},
        },
      },
      methods: {
        handleOk() {
          this.dialogResolve({ fromChild: true })
        },
      },
    }
    const p = manager.open({
      title: 'test',
      contentComponent: Child,
    })
    await new Promise((resolve) => setTimeout(resolve, 0))
    const btn = document.querySelector('.child-footer-ok')
    expect(btn).toBeTruthy()
    expect(btn.textContent.trim()).toBe('Ок')
    btn.click()
    expect(manager.size).toBe(0)
    await expect(p).resolves.toEqual({ fromChild: true })
  })

  it('content component footer slot takes precedence over standard buttons', async () => {
    const Child = {
      template: `
        <div>
          <p>content</p>
          <template slot="footer">
            <button class="child-footer-custom">Custom</button>
          </template>
        </div>
      `,
    }
    manager.open({
      title: 'test',
      contentComponent: Child,
      footerButtons: FOOTER_BUTTONS.OK | FOOTER_BUTTONS.CANCEL,
    })
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(document.querySelector('.child-footer-custom')).toBeTruthy()
    expect(document.querySelector('.vdl-dialog__btn--primary')).toBeNull()
  })
})
