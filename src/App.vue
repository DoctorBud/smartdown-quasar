<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue';
import { initStore } from './composables/store';

export default defineComponent({
  name: 'App',
  setup() {
    initStore();
  },
});
</script>
