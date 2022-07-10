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
            v-model="note.content"
            :focused="focus" />

          <SourceEditor
            v-else
            class="full-width edit-border"
            v-model="note.content"
            :focused="focus" />
        </div>

        <div
          v-else>
          <smartdown
            class="q-mt-md q-pa-sm readonly-border"
            :initInput="note.content">
          </smartdown>
        </div>
      </div>
    </Container>
  </q-page>
</template>

<script>
/* global SQ */

import {
  computed,
  watch,
  ref,
  onBeforeMount,
} from 'vue';
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
    const focus = ref(true);
    const store = useStore();
    const note = computed({
      get: () => store.getNote.value,
    });
    const editMode = computed({
      get: () => store.getEditMode.value,
      set: store.updateEditMode,
    });

    onBeforeMount(() => {
      focus.value = editMode.value.editing && !editMode.value.detailed;
    });

    let oldSource = editMode.value.source;
    watch(
      editMode,
      () => {
        if (editMode.value.source && !oldSource) {
          editMode.value.editing = true;
        }
        oldSource = editMode.value.source;

        if (editMode.value.editing) {
          SQ.setToolbarVisibility(true);
          SQ.setToolbarTransparency(false);
          SQ.setToolbarFade(false);
        }
        focus.value = editMode.value.editing && !editMode.value.detailed;
      },
      { deep: true },
    );

    return {
      note, editMode, focus,
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
