<template>
  <div id="app">
    <h1>Vue Dialog Library Demo</h1>
    <div class="demo-sections">
      <DialogDemo />
      <ToastDemo />
      <PopupMenuDemo />
    </div>
  </div>
</template>

<script>
import DialogDemo from './components/DialogDemo.vue';
import ToastDemo from './components/ToastDemo.vue';
import PopupMenuDemo from './components/PopupMenuDemo.vue';

export default {
  name: 'App',
  components: {
    DialogDemo,
    ToastDemo,
    PopupMenuDemo,
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f0f2f5;
  color: #333;
}

#app {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 20px;
}

h1 {
  font-size: 28px;
  margin-bottom: 24px;
  color: #1a1a1a;
}

.demo-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
