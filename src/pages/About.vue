<template>
  <q-page padding>
    <Container>
      <h1>About</h1>
    </Container>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
// import { useLocalNotes } from 'src/helper';
// import { useRouter } from 'vue-router';

// import Editor from 'src/components/Editor.vue';
import Container from 'src/components/Container.vue';

export default defineComponent({
  components: { Container },
  name: 'About',
  setup() {
    return {};
  },
});
</script>
