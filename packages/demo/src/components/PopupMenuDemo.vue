<template>
  <div class="demo-section">
    <h2>Popup Menus</h2>
    <div class="demo-buttons">
      <button @click="showBasicMenu">
        Basic Menu
      </button>
      <button @click="showIconMenu">
        Menu with Icons
      </button>
      <button @click="showFontAwesomeMenu">
        Menu with FontAwesome
      </button>
    </div>
    <div v-if="result" class="demo-result">
      <strong>Selected:</strong> {{ result }}
    </div>
    <div v-if="error" class="demo-error">
      <strong>Closed:</strong> {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'PopupMenuDemo',

  data() {
    return {
      result: null,
      error: null,
    };
  },

  methods: {
    clearStatus() {
      this.result = null;
      this.error = null;
    },

    showBasicMenu(event) {
      this.clearStatus();
      const rect = event.target.getBoundingClientRect();
      this.$popupMenu.show({
        items: [
          { text: 'Open', value: 'open' },
          { text: 'Save', value: 'save' },
          { text: 'Delete', value: 'delete' },
          { text: 'Export', value: 'export' },
        ],
        x: rect.left,
        y: rect.bottom + 4,
      })
        .then((item) => {
          this.result = item.text + ' (' + item.value + ')';
        })
        .catch((reason) => {
          this.error = 'Menu closed: ' + reason;
        });
    },

    showIconMenu(event) {
      this.clearStatus();
      const rect = event.target.getBoundingClientRect();
      this.$popupMenu.show({
        items: [
          { text: 'Open', icon: '\u{1F4C2}', value: 'open' },
          { text: 'Save', icon: '\u{1F4BE}', value: 'save' },
          { text: 'Delete', icon: '\u{1F5D1}', value: 'delete' },
          { text: 'Settings', icon: '\u2699', value: 'settings' },
        ],
        x: rect.left,
        y: rect.bottom + 4,
      })
        .then((item) => {
          this.result = item.icon + ' ' + item.text + ' (' + item.value + ')';
        })
        .catch((reason) => {
          this.error = 'Menu closed: ' + reason;
        });
    },

    showFontAwesomeMenu(event) {
      this.clearStatus();
      const rect = event.target.getBoundingClientRect();
      this.$popupMenu.show({
        items: [
          { text: 'Edit', icon: 'fa fa-edit', value: 'edit' },
          { text: 'Copy', icon: 'fa fa-copy', value: 'copy' },
          { text: 'Paste', icon: 'fa fa-clipboard', value: 'paste' },
          { text: 'Cut', icon: 'fa fa-cut', value: 'cut' },
        ],
        x: rect.left,
        y: rect.bottom + 4,
      })
        .then((item) => {
          this.result = item.text + ' (' + item.value + ')';
        })
        .catch((reason) => {
          this.error = 'Menu closed: ' + reason;
        });
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

.demo-result {
  margin-top: 16px;
  padding: 10px 14px;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 4px;
  font-size: 13px;
  word-break: break-all;
}

.demo-error {
  margin-top: 16px;
  padding: 10px 14px;
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 4px;
  font-size: 13px;
  word-break: break-all;
}
</style>
