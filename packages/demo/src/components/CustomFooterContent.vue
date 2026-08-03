<template>
  <div class="custom-footer-content">
    <p>{{ message }}</p>
    <p>Approve/Deny buttons are rendered in the dialog footer via the named slot.</p>
    <template slot="footer">
      <button
        class="vdl-dialog__btn"
        @click="handleDeny"
      >
        Deny
      </button>
      <button
        class="vdl-dialog__btn vdl-dialog__btn--primary"
        @click="handleApprove"
      >
        Approve
      </button>
    </template>
  </div>
</template>

<script>
export default {
  name: 'CustomFooterContent',

  props: {
    message: {
      type: String,
      default: '',
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
    handleApprove() {
      this.dialogResolve({ approved: true });
    },
    handleDeny() {
      this.dialogReject('user denied');
    },
  },
};
</script>

<style scoped>
.custom-footer-content {
  font-size: 14px;
  line-height: 1.6;
}
</style>
