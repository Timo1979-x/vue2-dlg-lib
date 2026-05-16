<template>
  <div class="vdl-popup-menu-overlay" :style="{ zIndex }" @mousedown.self="handleClose">
    <div
      ref="menu"
      class="vdl-popup-menu"
      :style="menuStyles"
      role="menu"
      tabindex="-1"
    >
      <div
        v-for="(item, index) in items"
        :key="index"
        class="vdl-popup-menu__item"
        :class="{ 'vdl-popup-menu__item--highlighted': index === highlightedIndex }"
        role="menuitem"
        @click="selectItem(item)"
        @mouseenter="highlightedIndex = index"
      >
        <span v-if="item.icon" class="vdl-popup-menu__icon">
          <i v-if="typeof item.icon === 'string' && item.icon.startsWith('fa')" :class="item.icon" />
          <span v-else>{{ item.icon }}</span>
        </span>
        <span class="vdl-popup-menu__text">{{ item.text }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PopupMenu',

  props: {
    items: {
      type: Array,
      required: true,
    },
    x: {
      type: Number,
      default: 0,
    },
    y: {
      type: Number,
      default: 0,
    },
    zIndex: {
      type: Number,
      default: 2500,
    },
  },

  data() {
    return {
      highlightedIndex: -1,
    };
  },

  computed: {
    menuStyles() {
      return {
        left: this.x + 'px',
        top: this.y + 'px',
      };
    },
  },

  mounted() {
    this.highlightedIndex = -1;
    document.addEventListener('keydown', this.onKeyDown);
    this.$nextTick(() => {
      if (this.$refs.menu) {
        this.$refs.menu.focus();
      }
    });
  },

  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeyDown);
  },

  methods: {
    onKeyDown(e) {
      if (!this.items.length) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          this.highlightedIndex = (this.highlightedIndex + 1) % this.items.length;
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.highlightedIndex = (this.highlightedIndex - 1 + this.items.length) % this.items.length;
          break;
        case 'Enter':
          e.preventDefault();
          if (this.highlightedIndex >= 0) {
            this.selectItem(this.items[this.highlightedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          this.reject('escape');
          break;
      }
    },

    selectItem(item) {
      this.$emit('resolve', item);
    },

    handleClose() {
      this.$emit('reject', 'closed by outside click');
    },

    reject(reason) {
      this.$emit('reject', reason);
    },
  },
};
</script>

<style scoped>
.vdl-popup-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

.vdl-popup-menu {
  position: absolute;
  min-width: 180px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.15);
  padding: 4px 0;
  outline: none;
}

.vdl-popup-menu__item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.1s;
  font-size: 14px;
  color: #333;
}

.vdl-popup-menu__item:hover,
.vdl-popup-menu__item--highlighted {
  background: #e6f7ff;
}

.vdl-popup-menu__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  margin-right: 10px;
  font-size: 14px;
}

.vdl-popup-menu__text {
  flex: 1;
}
</style>
