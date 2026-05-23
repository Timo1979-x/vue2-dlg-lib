import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import Vue from 'vue'
import DialogManager from '../dialog/DialogManager'

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
})
