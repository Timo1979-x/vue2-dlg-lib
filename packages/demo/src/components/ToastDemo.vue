<template>
  <div class="demo-section">
    <h2>Toast Messages</h2>
    <div class="demo-buttons">
      <button @click="showDefaultToast">
        Default Toast
      </button>
      <button @click="showSuccessToast">
        Success Toast
      </button>
      <button @click="showWarningToast">
        Warning Toast
      </button>
      <button @click="showErrorToast">
        Error Toast
      </button>
      <button @click="showShortDurationToast">
        Short Duration (2s)
      </button>
      <button @click="showLongDurationToast">
        Long Duration (10s)
      </button>
      <button @click="showPersistentToast">
        Persistent (no auto-close)
      </button>
      <button @click="showMultipleToasts">
        Show 3 Auto-Close Toasts
      </button>
      <button @click="closeAllToasts">
        Close All Toasts
      </button>
    </div>
    <div class="demo-info">
      <strong>Active toasts:</strong> {{ activeCount }}
    </div>
  </div>
</template>

<script>
export default {
  name: "ToastDemo",

  computed: {
    activeCount() {
      return this.$toast.size;
    },
  },

  methods: {
    showDefaultToast() {
      this.$toast.show({
        message: "This is a default toast message.",
        duration: 0,
      });
    },

    showSuccessToast() {
      this.$toast.show({
        message: "Operation completed successfully!",
        duration: 4000,
        type: "success",
      });
    },

    showWarningToast() {
      this.$toast.show({
        message: "Warning: please review your input.",
        duration: 6000,
        type: "warning",
      });
    },

    showErrorToast() {
      this.$toast.show({
        message: "An error occurred. Please try again.",
        duration: 8000,
        type: "error",
      });
    },

    showShortDurationToast() {
      this.$toast.show({
        message: "This toast auto-closes in 2 seconds.",
        duration: 2000,
        type: "info",
      });
    },

    showLongDurationToast() {
      this.$toast.show({
        message:
          "This toast stays visible for 10 seconds. Hover to pause the timer.",
        duration: 10000,
        type: "default",
      });
    },

    showPersistentToast() {
      this.$toast.show({
        message:
          "This toast will stay until you close it manually (duration: 0).",
        duration: 0,
      });
    },

    showMultipleToasts() {
      this.$toast.show({
        message: "Toast #1",
        duration: 5000,
        type: "success",
      });
      this.$toast.show({
        message: "Toast #2",
        duration: 5000,
        type: "warning",
      });
      this.$toast.show({ message: "Toast #3", duration: 5000, type: "error" });
    },

    closeAllToasts() {
      this.$toast.closeAll();
    },
  },
};
</script>

<style scoped>
.demo-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

h2 {
  font-size: 20px;
  margin-bottom: 16px;
}

.demo-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.demo-buttons button {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.15s, border-color 0.15s;
}

.demo-buttons button:hover {
  background: #e6f7ff;
  border-color: #1890ff;
}

.demo-info {
  margin-top: 12px;
  font-size: 13px;
  color: #666;
}
</style>
