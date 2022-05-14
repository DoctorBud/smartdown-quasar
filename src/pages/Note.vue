<template>
  <q-page>
    <Container>
      <div class="q-gutter-lg">
        <q-toggle
          size="sm"
          v-model="editing"
          icon="edit"
          label="Editing" />

        <q-toggle
          v-if="editing"
          size="sm"
          v-model="source"
          icon="img:icons/Markdown-mark.svg"
          label="Markdown" />

        <q-btn
          class="q-ml-sm float-right"
          size="sm"
          round
          color="red"
          icon="delete"
          @click="confirm = true"
        />

        <q-dialog v-model="confirm" persistent>
          <q-card>
            <q-card-section class="row items-center">
              <q-avatar icon="check" color="primary" text-color="white" />
              <span class="q-ml-sm">Please confirm that you wish to delete this note.</span>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Never Mind" color="primary" v-close-popup />
              <q-btn
                @click="remove"
                flat label="Remove Note" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>

      <div
        v-if="editing">
        <q-input
          v-model="note.title"
          label="Title" filled
        />
        <q-input
          v-model="note.description"
          label="Description"
          filled
          class="q-mt-sm"
          dense
        />
        <Editor
          v-if="!source"
          class="full-width edit-border"
          v-model="note.content" />
        <q-input
          v-else
          v-model="note.content"
          class="full-width edit-source-border"
          style="max-height: 50vh; overflow: auto;"
          filled autogrow
          type="textarea"
        />
      </div>

      <div v-else>
        <q-input
          readonly
          v-model="note.title"
          label="Title" filled
        />
        <q-input
          readonly
          v-model="note.description"
          label="Description"
          filled
        />

        <q-markdown
          v-if="!useSmartdown"
          class="q-mt-md q-pa-sm readonly-border"
          :src="note.content">
        </q-markdown>

        <smartdown
          v-else
          class="q-mt-md q-pa-sm readonly-border"
          :initInput="note.content">
        </smartdown>

      </div>
    </Container>
  </q-page>
</template>

<script>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLocalNotes } from 'src/helper';

import Editor from 'src/components/Editor.vue';
import Container from 'src/components/Container.vue';
import Smartdown from 'src/components/Smartdown.vue';

export default {
  components: { Container, Editor, Smartdown },
  setup() {
    const notes = useLocalNotes();
    const route = useRoute();
    const noteId = computed(() => parseInt(route.params.id, 10));
    const note = computed(() => notes.value[noteId.value]);

    const editing = ref(false);
    const source = ref(false);
    const confirm = ref(false);
    const useSmartdown = ref(true);

    const router = useRouter();
    const remove = () => {
      notes.value.splice(noteId.value, 1);
      router.push('/');
    };

    return {
      note, editing, remove, source, confirm, useSmartdown,
    };
  },
};
</script>

<style>
.q-field--readonly .q-field__control::before,
.q-field--filled .q-field__control::before {
  opacity: 1;
  background: transparent;
  border: 1px solid darkgray;
  padding: 0;
  margin:  0;
}
</style>
