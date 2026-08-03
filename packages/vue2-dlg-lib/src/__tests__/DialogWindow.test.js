import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DialogWindow from '../dialog/DialogWindow.vue'

describe('DialogWindow', () => {
  let wrapper

  afterEach(() => {
    if (wrapper) {
      wrapper.destroy()
    }
  })

  it('renders title prop', () => {
    wrapper = mount(DialogWindow, {
      propsData: { title: 'Тестовый диалог' },
    })
    expect(wrapper.find('.vdl-dialog__title').text()).toBe('Тестовый диалог')
  })

  it('emits reject on close button click', async () => {
    wrapper = mount(DialogWindow, {
      propsData: { title: 'Test' },
    })
    await wrapper.find('.vdl-dialog__btn--close').trigger('click')
    expect(wrapper.emitted('reject')).toBeTruthy()
    expect(wrapper.emitted('reject')[0]).toEqual(['closed'])
  })

  it('emits reject on overlay click when closeOnClickOutside is true', async () => {
    wrapper = mount(DialogWindow, {
      propsData: { title: 'Test', closeOnClickOutside: true },
    })
    await wrapper.find('.vdl-dialog-overlay').trigger('mousedown')
    expect(wrapper.emitted('reject')).toBeTruthy()
    expect(wrapper.emitted('reject')[0]).toEqual(['closed by outside click'])
  })

  it('does not emit reject on overlay click when closeOnClickOutside is false', async () => {
    wrapper = mount(DialogWindow, {
      propsData: { title: 'Test', closeOnClickOutside: false },
    })
    await wrapper.find('.vdl-dialog-overlay').trigger('mousedown')
    expect(wrapper.emitted('reject')).toBeFalsy()
  })

  it('renders contentComponent and passes dialogResolve/dialogReject props', () => {
    const TestComponent = {
      template: '<div><p class="greeting">{{ greeting }}</p></div>',
      props: ['greeting', 'dialogResolve', 'dialogReject'],
    }
    wrapper = mount(DialogWindow, {
      propsData: {
        title: 'Test',
        contentComponent: TestComponent,
        contentProps: { greeting: 'Hello' },
      },
    })
    expect(wrapper.find('.greeting').text()).toBe('Hello')
  })

  it('renders default slot content', () => {
    wrapper = mount(DialogWindow, {
      propsData: { title: 'Test' },
      slots: { default: '<p class="custom-body">Custom body content</p>' },
    })
    expect(wrapper.find('.custom-body').text()).toBe('Custom body content')
  })

  it('renders footer slot over default footer', () => {
    wrapper = mount(DialogWindow, {
      propsData: { title: 'Test' },
      slots: { footer: '<button class="custom-footer-btn">OK</button>' },
    })
    expect(wrapper.find('.custom-footer-btn').exists()).toBe(true)
    expect(wrapper.find('.vdl-dialog__btn--primary').exists()).toBe(false)
  })

  it('renders default footer with close button when no footer slot', () => {
    wrapper = mount(DialogWindow, {
      propsData: { title: 'Test' },
    })
    expect(wrapper.find('.vdl-dialog__btn--primary').exists()).toBe(true)
    expect(wrapper.find('.vdl-dialog__btn--primary').text()).toBe('Закрыть')
  })

  it('default footer close button emits reject', async () => {
    wrapper = mount(DialogWindow, {
      propsData: { title: 'Test' },
    })
    await wrapper.find('.vdl-dialog__btn--primary').trigger('click')
    expect(wrapper.emitted('reject')).toBeTruthy()
  })

  it('renders standard footer buttons selected by bitmask', () => {
    wrapper = mount(DialogWindow, {
      propsData: { title: 'Test', footerButtons: 1 | 16 },
    })
    const labels = wrapper.findAll('.vdl-dialog__footer .vdl-dialog__btn').wrappers
      .map((b) => b.text().trim())
    expect(labels).toEqual(['Ок', 'Отмена'])
  })

  it('renders all standard footer buttons for the full bitmask', () => {
    wrapper = mount(DialogWindow, {
      propsData: { title: 'Test', footerButtons: 1 | 2 | 4 | 8 | 16 },
    })
    const labels = wrapper.findAll('.vdl-dialog__footer .vdl-dialog__btn').wrappers
      .map((b) => b.text().trim())
    expect(labels).toEqual(['Ок', 'Да', 'Нет', 'Закрыть', 'Отмена'])
  })

  it('renders no footer buttons when bitmask is 0', () => {
    wrapper = mount(DialogWindow, {
      propsData: { title: 'Test', footerButtons: 0 },
    })
    expect(wrapper.find('.vdl-dialog__footer .vdl-dialog__btn').exists()).toBe(false)
  })

  it('Ок button emits resolve with its bitmask value', async () => {
    wrapper = mount(DialogWindow, {
      propsData: { title: 'Test', footerButtons: 1 | 16 },
    })
    const ok = wrapper.findAll('.vdl-dialog__footer .vdl-dialog__btn').wrappers
      .find((b) => b.text().trim() === 'Ок')
    await ok.trigger('click')
    expect(wrapper.emitted('resolve')).toBeTruthy()
    expect(wrapper.emitted('resolve')[0]).toEqual([1])
  })

  it('Отмена button emits reject with its bitmask value', async () => {
    wrapper = mount(DialogWindow, {
      propsData: { title: 'Test', footerButtons: 1 | 16 },
    })
    const cancel = wrapper.findAll('.vdl-dialog__footer .vdl-dialog__btn').wrappers
      .find((b) => b.text().trim() === 'Отмена')
    await cancel.trigger('click')
    expect(wrapper.emitted('reject')).toBeTruthy()
    expect(wrapper.emitted('reject')[0]).toEqual([16])
  })

  it('default close button emits reject with CLOSE bitmask value', async () => {
    wrapper = mount(DialogWindow, {
      propsData: { title: 'Test' },
    })
    await wrapper.find('.vdl-dialog__footer .vdl-dialog__btn--primary').trigger('click')
    expect(wrapper.emitted('reject')[0]).toEqual([8])
  })

  it('renders footer buttons from content component named slot', async () => {
    const Child = {
      template: `
        <div>
          <p>body</p>
          <template slot="footer">
            <button class="child-footer-btn">Ок</button>
          </template>
        </div>
      `,
    }
    wrapper = mount(DialogWindow, {
      propsData: { title: 'Test', contentComponent: Child },
    })
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    const btn = wrapper.find('.child-footer-btn')
    expect(btn.exists()).toBe(true)
    expect(btn.text().trim()).toBe('Ок')
  })

  it('content component footer slot takes precedence over standard buttons', async () => {
    const Child = {
      template: `
        <div>
          <p>body</p>
          <template slot="footer">
            <button class="child-footer-btn">Ок</button>
          </template>
        </div>
      `,
    }
    wrapper = mount(DialogWindow, {
      propsData: { title: 'Test', contentComponent: Child, footerButtons: 8 },
    })
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.child-footer-btn').exists()).toBe(true)
    expect(wrapper.find('.vdl-dialog__footer .vdl-dialog__btn--primary').exists()).toBe(false)
  })

  it('toggles isMaximized on maximize button click', async () => {
    wrapper = mount(DialogWindow, {
      propsData: { title: 'Test' },
    })
    const buttons = wrapper.findAll('.vdl-dialog__btn--icon')
    const maxBtn = buttons.at(0)
    expect(wrapper.vm.isMaximized).toBe(false)
    await maxBtn.trigger('click')
    expect(wrapper.vm.isMaximized).toBe(true)
    await maxBtn.trigger('click')
    expect(wrapper.vm.isMaximized).toBe(false)
  })

  it('applies overlay z-index from prop', () => {
    wrapper = mount(DialogWindow, {
      propsData: { title: 'Test', zIndex: 2020 },
    })
    const overlay = wrapper.find('.vdl-dialog-overlay')
    expect(overlay.attributes('style')).toContain('z-index: 2020')
  })

  it('emits bring-to-front on dialog mousedown', async () => {
    wrapper = mount(DialogWindow, {
      propsData: { title: 'Test' },
    })
    await wrapper.find('.vdl-dialog').trigger('mousedown')
    expect(wrapper.emitted('bring-to-front')).toBeTruthy()
  })

  it('shows resize handle when resizable is true and not maximized', () => {
    wrapper = mount(DialogWindow, {
      propsData: { title: 'Test', resizable: true },
    })
    expect(wrapper.find('.vdl-dialog__resize-handle').exists()).toBe(true)
  })

  it('hides resize handle when resizable is false', () => {
    wrapper = mount(DialogWindow, {
      propsData: { title: 'Test', resizable: false },
    })
    expect(wrapper.find('.vdl-dialog__resize-handle').exists()).toBe(false)
  })

  it('hides resize handle when maximized', async () => {
    wrapper = mount(DialogWindow, {
      propsData: { title: 'Test', resizable: true },
    })
    const maxBtn = wrapper.findAll('.vdl-dialog__btn--icon').at(0)
    await maxBtn.trigger('click')
    expect(wrapper.find('.vdl-dialog__resize-handle').exists()).toBe(false)
  })
})
