<template>
  <div class="demo-section">
    <h2>Modal Dialogs</h2>
    <div class="demo-buttons">
      <button @click="openBasicDialog">Basic Dialog</button>
      <button @click="openComponentDialog">Dialog with Component</button>
      <button @click="openStackedDialog">Stacked Dialog (nested)</button>
      <button @click="openCustomFooterDialog">Custom Footer</button>
      <button @click="openSizedDialog('60vw', '50vh')">Custom Size (60vw x 50vh)</button>
      <button @click="openSizedDialog('120vw', '120vh')">Custom Size (120vw x 120vh)</button>
      <button @click="openNonClosableDialog">No Close on Outside Click</button>
    </div>
    <div v-if="result" class="demo-result">
      <strong>Result:</strong> {{ result }}
    </div>
    <div v-if="error" class="demo-error">
      <strong>Error:</strong> {{ error }}
      <span @click="clearStatus" class="close-button">x</span>
    </div>
  </div>
</template>

<script>
import SampleDialogContent from "./SampleDialogContent.vue";
import StackedDemoContent from "./StackedDemoContent.vue";

export default {
  name: "DialogDemo",

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

    openBasicDialog() {
      this.clearStatus();
      this.$dialog
        .open({
          title: "Basic Dialog",
          width: "400px",
          height: "250px",
        })
        .then((data) => {
          this.result = JSON.stringify(data);
        })
        .catch((reason) => {
          this.error = "Rejected: " + reason;
        });
    },

    openComponentDialog() {
      this.clearStatus();
      this.$dialog
        .open({
          title: "Component Dialog",
          contentComponent: SampleDialogContent,
          contentProps: {
            message: "Hello from component!",
            customValue: "dynamic value",
          },
          width: "500px",
          height: "300px",
        })
        .then((data) => {
          this.result = JSON.stringify(data);
        })
        .catch((reason) => {
          this.error = "Rejected: " + reason;
        });
    },

    openStackedDialog() {
      this.clearStatus();
      this.$dialog
        .open({
          title: "Parent Dialog",
          contentComponent: StackedDemoContent,
          width: "480px",
          height: "280px",
        })
        .then((data) => {
          this.result = "Parent dialog resolved: " + JSON.stringify(data);
        })
        .catch((reason) => {
          this.error = "Parent dialog rejected: " + reason;
        });
    },

    openCustomFooterDialog() {
      this.clearStatus();

      this.$dialog
        .open({
          title: "Custom Footer Dialog",
          contentComponent: SampleDialogContent,
          contentProps: {
            message:
              "This dialog has a custom footer with Approve/Deny buttons.",
          },
          width: "480px",
          height: "320px",
        })
        .then((data) => {
          this.result = JSON.stringify(data);
        })
        .catch((reason) => {
          this.error = "Rejected: " + reason;
        });
    },

    openSizedDialog(width, height) {
      this.clearStatus();
      this.$dialog
        .open({
          title: "Custom Size Dialog",
          width,
          height,
        })
        .then((data) => {
          this.result = JSON.stringify(data);
        })
        .catch((reason) => {
          this.error = "Rejected: " + reason;
        });
    },

    openNonClosableDialog() {
      this.clearStatus();
      this.$dialog
        .open({
          title: "No Outside Click Close",
          closeOnClickOutside: false,
          width: "400px",
          height: "250px",
        })
        .then((data) => {
          this.result = JSON.stringify(data);
        })
        .catch((reason) => {
          this.error = "Rejected: " + reason;
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

.close-button {
  /* position: absolute;
  top: 0;
  right: 15px; */
  float: right;
  display: block;
  cursor: pointer;
}
</style>
