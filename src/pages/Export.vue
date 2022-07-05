<template>
  <q-page padding>
    <Container>
      <h3>
        <q-avatar icon="file_download" color="primary" text-color="white" />
        Export
      </h3>

      <div
        style="border: 3px solid lightgray; padding: 5px;"
        v-if="note">
        <h3>{{ note.title }}</h3>
        <p>{{ note.description }}</p>
        <hr>
        <q-btn
          @click="exportCurrentNote"
          flat label="Export Current Note" color="primary"
        />
      </div>

      <div
        style="border: 3px solid lightgray; padding: 5px;"
        v-else>
        <hr>
        <q-btn
          @click="exportAllNotes"
          flat label="Export All Notes" color="primary"
        />
      </div>
   </Container>
  </q-page>
</template>

<script>
import {
  defineComponent,
  computed,
} from 'vue';
import { useRoute } from 'vue-router';
import { exportFile, Platform } from 'quasar';

// https://capacitorjs.com/docs/apis/filesystem
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

import Container from 'src/components/Container.vue';
import { lookupNoteByTitle } from 'src/composables/notes';

export default defineComponent({
  components: { Container },
  name: 'Export',
  setup() {
    const route = useRoute();
    const note = computed(() => lookupNoteByTitle(route.params.id));

    const exportCurrentNote = async () => {
      const title = note.value.title.replaceAll('/', '__');
      const extension = title.endsWith('.md') ? '' : '.md';
      const outputFilename = `${title}${extension}`;
      const outputText = note.value.content;

      if (Platform.is.capacitor) {
        try {
          await Filesystem.writeFile({
            path: outputFilename,
            data: outputText,
            directory: Directory.Documents,
            encoding: Encoding.UTF8,
          });
        } catch (e) {
          console.log('#e', e);
        }
      } else {
        const status = exportFile(outputFilename, outputText);

        if (status === true) {
          // browser allowed it
        } else {
          // browser denied it
          console.log('Error: ', status);
        }
      }
    };

    const exportAllNotes = async () => {
      console.log('#exportAllNotes NYI');
    };

    return {
      note,
      exportCurrentNote,
      exportAllNotes,
    };
  },
});
</script>
