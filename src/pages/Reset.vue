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
              @click="clearNotes"
              flat label="Delete All" color="primary" v-close-popup />
            <q-btn
              @click="loadGallery"
              flat label="Load Gallery" color="primary" v-close-popup />
            <q-btn
              @click="cancel"
              flat label="Never Mind" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </Container>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { deleteAllNotes, loadGalleryNotes } from 'src/helper';
import { useRouter } from 'vue-router';

import Container from 'src/components/Container.vue';

export default defineComponent({
  components: { Container },
  name: 'Reset',
  setup() {
    const confirm = ref(true);

    const router = useRouter();
    const cancel = () => {
      router.push('/');
    };

    const clearNotes = async () => {
      await deleteAllNotes();
      router.push('/');
    };

    const loadGallery = async () => {
      await loadGalleryNotes();
      router.push('/');
    };

    return {
      confirm,
      cancel,
      clearNotes,
      loadGallery,
    };
  },
});
</script>
