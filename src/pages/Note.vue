<template>
  <q-page>
    <Container>
      <div
        v-if="editMode.editing">
        <Editor
          v-if="!editMode.source"
          class="full-width edit-border"
          v-model="note.content" />

        <q-input
          v-else
          v-model="note.content"
          class="full-width edit-source-border markdown-editor"
          filled autogrow
          type="textarea"
        />
      </div>

      <div
        v-else>
        <smartdown
          class="q-mt-md q-pa-sm readonly-border"
          :initInput="note.content">
        </smartdown>
      </div>
    </Container>
  </q-page>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useLocalNotes } from 'src/helper';
import { useStore } from 'src/composables/store';

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

    const store = useStore();
    console.log('####store', store);
    const editMode = computed({
      get: () => store.getEditMode.value,
      set: store.updateEditMode,
    });

    store.updateNote(note);

    return {
      note, editMode,
    };
  },
};
</script>

<style>
.markdown-editor {
  background-color: ivory;
  overflow: auto;
}

.q-field--readonly .q-field__control::before,
.q-field--filled .q-field__control::before {
  opacity: 1;
  background: transparent;
  border: 1px solid darkgray;
  padding: 0;
  margin:  0;
}
</style>
