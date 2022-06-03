<template>
  <q-page padding>
    <Container>
      <h1>Reset</h1>

      <q-dialog v-model="confirm" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="check" color="primary" text-color="white" />
            <span class="q-ml-sm">Please confirm that you wish to delete this note.</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              @click="cancel"
              flat label="Never Mind" color="primary" v-close-popup />
            <q-btn
              @click="reset"
              flat label="Reset Notes" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </Container>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useLocalNotes, getGalleryNotes } from 'src/helper';
import { useRouter } from 'vue-router';

import Container from 'src/components/Container.vue';

export default defineComponent({
  components: { Container },
  name: 'Reset',
  setup() {
    console.log('Reset.setup()');
    const confirm = ref(true);

    const router = useRouter();
    const cancel = () => {
      console.log('#cancel');
      router.push('/');
    };

    const reset = async () => {
      console.log('#reset');

      const notes = useLocalNotes();

      const newNotes = await getGalleryNotes();

      notes.value.splice(0, notes.value.length, ...newNotes);
      router.push('/');
    };

    return {
      confirm,
      cancel,
      reset,
    };
  },
});
</script>
