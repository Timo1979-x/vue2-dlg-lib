<template>
  <div
    class="vdl-toast"
    :class="['vdl-toast--' + type, { 'vdl-toast--exiting': exiting }]"
    :style="toastStyles"
    @mouseenter="pauseTimer"
    @mouseleave="resumeTimer"
  >
    <div class="vdl-toast__content">
      {{ message }}
      <button
        class="vdl-toast__close-btn"
        title="Закрыть"
        @click="close"
      >
        &#x2715;
      </button>
    </div>
    <div
      v-if="duration"
      class="vdl-toast__progress"
      :style="progressStyle"
    />
  </div>
</template>

<script>
export default {
  name: 'Toast',

  props: {
    message: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 5000,
    },
    type: {
      type: String,
      default: 'default',
    },
    index: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      remainingMs: 0,
      startTime: 0,
      timerId: null,
      exiting: false,
      isPaused: false,
    };
  },

  computed: {
    toastStyles() {
      return {
        zIndex: 3000 + this.index,
      };
    },

    progressPercent() {
      if (!this.duration) return 100;
      if (this.isPaused) {
        return (this.remainingMs / this.duration) * 100;
      }
      const elapsed = Date.now() - this.startTime;
      const remaining = Math.max(0, this.duration - elapsed);
      return (remaining / this.duration) * 100;
    },

    progressStyle() {
      if (!this.duration) return { width: '100%' };
      return {
        width: this.progressPercent + '%',
        transition: this.isPaused ? 'none' : 'width 0.1s linear',
      };
    },
  },

  mounted() {
    if (this.duration) {
      this.remainingMs = this.duration;
      this.startTime = Date.now();
      this.startTimer();
    }
  },

  beforeDestroy() {
    this.clearTimer();
  },

  methods: {
    startTimer() {
      this.clearTimer();
      this.isPaused = false;
      this.startTime = Date.now();
      this.timerId = setTimeout(() => {
        this.close();
      }, this.remainingMs);
    },

    pauseTimer() {
      if (!this.duration || this.isPaused) return;
      this.isPaused = true;
      const elapsed = Date.now() - this.startTime;
      this.remainingMs = Math.max(0, this.remainingMs - elapsed);
      this.clearTimer();
    },

    resumeTimer() {
      if (!this.duration || !this.isPaused || this.remainingMs <= 0) return;
      this.isPaused = false;
      this.startTimer();
    },

    clearTimer() {
      if (this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = null;
      }
    },

    close() {
      this.exiting = true;
      setTimeout(() => {
        this.$emit('close');
      }, 200);
    },
  },
};
</script>

<style scoped>
.vdl-toast {
  min-width: 280px;
  max-width: 420px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.vdl-toast--exiting {
  opacity: 0;
  transform: translateX(20px);
}

.vdl-toast--default {
  border-left: 4px solid #1890ff;
}

.vdl-toast--success {
  border-left: 4px solid #52c41a;
}

.vdl-toast--warning {
  border-left: 4px solid #faad14;
}

.vdl-toast--error {
  border-left: 4px solid #ff4d4f;
}

.vdl-toast__content {
  position: relative;
  padding: 12px 36px 12px 16px;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
}

.vdl-toast__close-btn {
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  font-size: 12px;
  line-height: 1;
  color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vdl-toast__close-btn:hover {
  background: rgba(0, 0, 0, 0.2);
  color: rgba(0, 0, 0, 0.8);
}

.vdl-toast__progress {
  height: 3px;
  background: #1890ff;
  width: 100%;
}

.vdl-toast--success .vdl-toast__progress {
  background: #52c41a;
}

.vdl-toast--warning .vdl-toast__progress {
  background: #faad14;
}

.vdl-toast--error .vdl-toast__progress {
  background: #ff4d4f;
}
</style>
