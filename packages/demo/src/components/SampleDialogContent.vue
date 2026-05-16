<template>
  <div class="sample-dialog-content">
    <p>{{ message }}</p>
    <p>Custom prop: <strong>{{ customValue }}</strong></p>
    <div class="sample-dialog-content__actions">
      <button @click="handleResolve">
        Confirm (resolve)
      </button>
      <button @click="handleReject">
        Cancel (reject)
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SampleDialogContent',

  props: {
    message: {
      type: String,
      default: 'Это содержимое диалога.',
    },
    customValue: {
      type: String,
      default: 'test',
    },
    dialogResolve: {
      type: Function,
      default: () => {},
    },
    dialogReject: {
      type: Function,
      default: () => {},
    },
  },

  methods: {
    handleResolve() {
      this.dialogResolve({ confirmed: true, value: 'resolved data' });
    },
    handleReject() {
      this.dialogReject('user cancelled');
    },
  },
};
</script>

<style scoped>
.sample-dialog-content {
  font-size: 14px;
  line-height: 1.6;
}

.sample-dialog-content__actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.sample-dialog-content__actions button {
  padding: 8px 20px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  background: #fff;
  transition: background 0.15s;
}

.sample-dialog-content__actions button:first-child {
  background: #1890ff;
  color: #fff;
  border-color: #1890ff;
}

.sample-dialog-content__actions button:first-child:hover {
  background: #096dd9;
}

.sample-dialog-content__actions button:last-child:hover {
  background: #f5f5f5;
}
</style>
