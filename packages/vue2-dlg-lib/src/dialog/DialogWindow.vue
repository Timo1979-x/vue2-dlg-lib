<template>
  <div class="vdl-dialog-overlay" :style="overlayStyle" @mousedown.self="onOverlayClick">
    <div
      ref="dialog"
      class="vdl-dialog"
      :style="dialogStyles"
      @mousedown="bringToFront"
    >
      <div
        ref="header"
        class="vdl-dialog__header"
        @mousedown="startDrag"
      >
        <span class="vdl-dialog__title">{{ title }}</span>
        <div class="vdl-dialog__header-actions">
          <button
            class="vdl-dialog__btn vdl-dialog__btn--icon"
            :title="isMaximized ? 'Восстановить размер' : 'Развернуть на весь экран'"
            @click.stop="toggleMaximize"
          >
            {{ isMaximized ? '\u{1F5D7}' : '\u{1F5D6}' }}
          </button>
          <button
            class="vdl-dialog__btn vdl-dialog__btn--icon vdl-dialog__btn--close"
            title="Закрыть"
            @click.stop="handleClose"
          >
            &#x1F5D9;
          </button>
        </div>
      </div>
      <div class="vdl-dialog__body">
        <slot v-if="$slots.default" />
        <component
          :is="contentComponent"
          v-else-if="contentComponent"
          v-bind="contentProps"
          :dialog-resolve="resolve"
          :dialog-reject="reject"
        />
      </div>
      <div class="vdl-dialog__footer">
        <slot name="footer">
          <button
            class="vdl-dialog__btn vdl-dialog__btn--primary"
            @click="handleClose"
          >
            Закрыть
          </button>
        </slot>
      </div>
      <div
        v-if="resizable && !isMaximized"
        class="vdl-dialog__resize-handle"
        @mousedown.stop="startResize"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DialogWindow',

  props: {
    title: {
      type: String,
      default: '',
    },
    width: {
      type: [String, Number],
      default: '480px',
    },
    height: {
      type: [String, Number],
      default: '360px',
    },
    minWidth: {
      type: [String, Number],
      default: '280px',
    },
    minHeight: {
      type: [String, Number],
      default: '180px',
    },
    contentComponent: {
      type: [Object, Function],
      default: null,
    },
    contentProps: {
      type: Object,
      default: () => ({}),
    },
    closeOnClickOutside: {
      type: Boolean,
      default: true,
    },
    resizable: {
      type: Boolean,
      default: true,
    },
    draggable: {
      type: Boolean,
      default: true,
    },
    zIndex: {
      type: Number,
      default: 1000,
    },
  },

  data() {
    return {
      isMaximized: false,
      isDragging: false,
      isResizing: false,
      dragStartX: 0,
      dragStartY: 0,
      dragInitialLeft: 0,
      dragInitialTop: 0,
      resizeStartX: 0,
      resizeStartY: 0,
      resizeInitialWidth: 0,
      resizeInitialHeight: 0,
      currentWidth: this.normalizeSize(this.width, 'width'),
      currentHeight: this.normalizeSize(this.height, 'height'),
      currentLeft: null,
      currentTop: null,
    };
  },

  computed: {
    overlayStyle() {
      return { zIndex: this.zIndex };
    },

    dialogStyles() {
      if (this.isMaximized) {
        return {
          width: '100vw',
          height: '100vh',
          left: '0',
          top: '0',
        };
      }

      return {
        width: typeof this.currentWidth === 'number' ? this.currentWidth + 'px' : this.currentWidth,
        height: typeof this.currentHeight === 'number' ? this.currentHeight + 'px' : this.currentHeight,
        left: this.currentLeft !== null
          ? (typeof this.currentLeft === 'number' ? this.currentLeft + 'px' : this.currentLeft)
          : '50%',
        top: this.currentTop !== null
          ? (typeof this.currentTop === 'number' ? this.currentTop + 'px' : this.currentTop)
          : '50%',
        transform: (this.currentLeft === null && this.currentTop === null)
          ? 'translate(-50%, -50%)'
          : 'none',
      };
    },
  },

  mounted() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  },

  beforeDestroy() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  },

  methods: {
    normalizeSize(value, dimension) {
      if (typeof value === 'number') {
        return value;
      }
      if (typeof value === 'string') {
        const val = value.trim();
        if (/^\d+(\.\d+)?$/.test(val)) {
          return parseFloat(val);
        }
        if (val.endsWith('px')) {
          return parseFloat(val);
        }
        return val;
      }
      return dimension === 'width' ? '480px' : '360px';
    },

    bringToFront() {
      this.$emit('bring-to-front');
    },

    onOverlayClick() {
      if (this.closeOnClickOutside) {
        this.reject('closed by outside click');
      }
    },

    handleClose() {
      this.reject('closed');
    },

    reject(reason) {
      this.$emit('reject', reason);
    },

    resolve(data) {
      this.$emit('resolve', data);
    },

    toggleMaximize() {
      if (!this.isMaximized) {
        const rect = this.$refs.dialog.getBoundingClientRect();
        this.currentLeft = rect.left;
        this.currentTop = rect.top;
        this.currentWidth = rect.width;
        this.currentHeight = rect.height;
      }
      this.isMaximized = !this.isMaximized;
    },

    startDrag(e) {
      if (!this.draggable || this.isMaximized || e.target.closest('.vdl-dialog__btn')) {
        return;
      }
      this.isDragging = true;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;

      const rect = this.$refs.dialog.getBoundingClientRect();
      this.dragInitialLeft = rect.left;
      this.dragInitialTop = rect.top;

      if (this.currentLeft === null || this.currentTop === null) {
        this.currentLeft = rect.left;
        this.currentTop = rect.top;
      }
    },

    startResize(e) {
      if (!this.resizable || this.isMaximized) {
        return;
      }
      this.isResizing = true;
      this.resizeStartX = e.clientX;
      this.resizeStartY = e.clientY;

      const rect = this.$refs.dialog.getBoundingClientRect();
      this.resizeInitialWidth = rect.width;
      this.resizeInitialHeight = rect.height;

      if (typeof this.currentWidth === 'string') {
        this.currentWidth = rect.width;
      }
      if (typeof this.currentHeight === 'string') {
        this.currentHeight = rect.height;
      }
    },

    onMouseMove(e) {
      if (this.isDragging) {
        const dx = e.clientX - this.dragStartX;
        const dy = e.clientY - this.dragStartY;
        this.currentLeft = this.dragInitialLeft + dx;
        this.currentTop = this.dragInitialTop + dy;
      }

      if (this.isResizing) {
        let dx = e.clientX - this.resizeStartX;
        if (this.currentLeft == null) dx *= 2;
        let dy = e.clientY - this.resizeStartY;
        if (this.currentTop == null) dy *= 2;
        const minWidth = this.parsePixel(this.minWidth, 'width', 280);
        const minHeight = this.parsePixel(this.minHeight, 'height', 180);
        const newWidth = Math.max(minWidth, this.resizeInitialWidth + dx);
        const newHeight = Math.max(minHeight, this.resizeInitialHeight + dy);
        this.currentWidth = newWidth;
        this.currentHeight = newHeight;
      }
    },

    onMouseUp() {
      this.isDragging = false;
      this.isResizing = false;
    },

    parsePixel(value, dimension, fallback) {
      if (typeof value === 'number') return value;
      if (typeof value === 'string' && value.endsWith('px')) {
        return parseFloat(value);
      }
      return fallback;
    },
  },
};
</script>

<style scoped>
.vdl-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
}

.vdl-dialog {
  position: absolute;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  user-select: none;
}

.vdl-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  min-height: 44px;
  padding: 0 12px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  cursor: move;
}

.vdl-dialog__title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vdl-dialog__header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.vdl-dialog__body {
  flex: 1;
  overflow: auto;
  padding: 16px;
  min-height: 0;
}

.vdl-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 52px;
  min-height: 52px;
  padding: 8px 16px;
  background: #fafafa;
  border-top: 1px solid #e0e0e0;
  gap: 8px;
}

.vdl-dialog__resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 16px;
  height: 16px;
  cursor: nwse-resize;
}

.vdl-dialog__resize-handle::after {
  content: '';
  position: absolute;
  bottom: 3px;
  right: 3px;
  width: 8px;
  height: 8px;
  border-right: 2px solid #999;
  border-bottom: 2px solid #999;
}

.vdl-dialog__btn {
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.15s;
}

.vdl-dialog__btn--icon {
  padding: 4px 8px;
  background: transparent;
  font-size: 16px;
  line-height: 1;
  color: #666;
}

.vdl-dialog__btn--icon:hover {
  background: #e8e8e8;
}

.vdl-dialog__btn--close:hover {
  background: #ff4d4f;
  color: #fff;
}

.vdl-dialog__btn--primary {
  background: #1890ff;
  color: #fff;
}

.vdl-dialog__btn--primary:hover {
  background: #096dd9;
}
</style>
