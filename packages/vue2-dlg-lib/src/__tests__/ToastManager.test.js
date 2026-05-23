import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import Vue from 'vue'
import ToastManager from '../toast/ToastManager'

describe('ToastManager', () => {
  let manager

  beforeEach(() => {
    vi.useFakeTimers()
    manager = new ToastManager({ Vue })
  })

  afterEach(() => {
    manager.destroy()
    vi.useRealTimers()
  })

  it('starts with empty toasts array', () => {
    expect(manager.size).toBe(0)
  })

  it('creates container on first show', () => {
    manager.show({ message: 'test' })
    const container = document.querySelector('.vdl-toast-manager')
    expect(container).toBeTruthy()
  })

  it('show adds a toast', () => {
    manager.show({ message: 'Hello' })
    expect(manager.size).toBe(1)
  })

  it('show returns an entry object with vm', () => {
    const entry = manager.show({ message: 'Hello' })
    expect(entry).toBeDefined()
    expect(entry.vm).toBeDefined()
  })

  it('show accepts type and duration options', () => {
    manager.show({ message: 'Warning', type: 'warning', duration: 3000 })
    expect(manager.size).toBe(1)
  })

  it('closeAll removes all toasts', () => {
    manager.show({ message: '1' })
    manager.show({ message: '2' })
    manager.show({ message: '3' })
    expect(manager.size).toBe(3)
    manager.closeAll()
    vi.advanceTimersByTime(250)
    expect(manager.size).toBe(0)
  })

  it('Escape key closes all toasts', () => {
    manager.show({ message: '1' })
    manager.show({ message: '2' })
    expect(manager.size).toBe(2)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    vi.advanceTimersByTime(250)
    expect(manager.size).toBe(0)
  })

  it('destroy removes container and listeners', () => {
    manager.show({ message: 'test' })
    manager.destroy()
    expect(document.querySelector('.vdl-toast-manager')).toBeNull()
    expect(manager.size).toBe(0)
  })

  it('does not create container before show', () => {
    expect(document.querySelector('.vdl-toast-manager')).toBeNull()
  })
})
