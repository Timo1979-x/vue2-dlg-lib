<template>
  <div class="stacked-demo-content">
    <p>This is the first (parent) dialog. It stays on screen while child dialogs open on top.</p>
    <button class="stacked-demo-content__btn" @click="openChildDialog">
      Open Child Dialog
    </button>
    <div v-if="childResult" class="stacked-demo-content__result">
      Child dialog resolved: {{ childResult }}
    </div>
    <div v-if="childError" class="stacked-demo-content__error">
      Child dialog rejected: {{ childError }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'StackedDemoContent',

  props: {
    dialogResolve: {
      type: Function,
      default: () => {},
    },
    dialogReject: {
      type: Function,
      default: () => {},
    },
  },

  data() {
    return {
      childResult: null,
      childError: null,
    };
  },

  methods: {
    openChildDialog() {
      this.childResult = null;
      this.childError = null;

      this.$dialog.open({
        title: 'Child Dialog (on top)',
        width: '400px',
        height: '250px',
      })
        .then((data) => {
          this.childResult = JSON.stringify(data);
        })
        .catch((reason) => {
          this.childError = reason;
        });
    },
  },
};
</script>

<style scoped>
.stacked-demo-content {
  font-size: 14px;
  line-height: 1.6;
}

.stacked-demo-content__btn {
  margin-top: 12px;
  padding: 8px 20px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.15s;
}

.stacked-demo-content__btn:hover {
  background: #096dd9;
}

.stacked-demo-content__result {
  margin-top: 12px;
  padding: 8px 12px;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 4px;
  font-size: 13px;
  word-break: break-all;
}

.stacked-demo-content__error {
  margin-top: 12px;
  padding: 8px 12px;
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 4px;
  font-size: 13px;
  word-break: break-all;
}
</style>
