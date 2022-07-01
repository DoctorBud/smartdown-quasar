<template>
  <q-page>
    <Container>
      <div
        v-if="note">
        <div
          v-if="editMode.editing">
          <Editor
            v-if="!editMode.source"
            class="full-width edit-border"
            v-model="note.content" />

          <SourceEditor
            v-else
            class="full-width edit-border"
            v-model="note.content" />
        </div>

        <div
          v-else>
          <smartdown
            class="q-mt-md q-pa-sm readonly-border"
            :initInput="note.content">
          </smartdown>
        </div>
      </div>

      <div
        v-else>
        <h1>Missing Note</h1>
      </div>
    </Container>
  </q-page>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { lookupNoteByIndex } from 'src/composables/notes';
import { useStore } from 'src/composables/store';

import Editor from 'src/components/Editor.vue';
import Container from 'src/components/Container.vue';
import Smartdown from 'src/components/Smartdown.vue';
import SourceEditor from 'src/components/SourceEditor.vue';

export default {
  components: {
    Container,
    Editor,
    Smartdown,
    SourceEditor,
  },
  setup() {
    const route = useRoute();
    const note = computed(() => lookupNoteByIndex(parseInt(route.params.id, 10)));
    const store = useStore();
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
.q-field--readonly .q-field__control::before,
.q-field--filled .q-field__control::before {
  opacity: 1;
  background: transparent;
  border: 1px solid darkgray;
  padding: 0;
  margin:  0;
}
</style>
