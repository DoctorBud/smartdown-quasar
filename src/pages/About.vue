<template>
  <q-page padding>
    <Container>
      <h1>About</h1>
      <h4>
        <span>&nbsp;v{{ packageVersion }}</span>
      </h4>
    </Container>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
// import { useLocalNotes } from 'src/helper';
// import { useRouter } from 'vue-router';

// import Editor from 'src/components/Editor.vue';
import Container from 'src/components/Container.vue';

/* eslint-disable-next-line */
const packageVersion = process.env.packageVersion;

export default defineComponent({
  components: { Container },
  name: 'About',
  setup() {
    return {
      packageVersion,
    };
  },
});
</script>
