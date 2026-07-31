<template>
  <div class="custom-footer-content">
    <p>{{ message }}</p>
    <p>Approve/Deny buttons are rendered in the footer, not in the body.</p>
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
  },
};
</script>

<style scoped>
.custom-footer-content {
  font-size: 14px;
  line-height: 1.6;
}
</style>
