<template>
  <q-page padding>
    <Container>
      <div class="q-gutter-lg">
        <q-toggle
          size="sm"
          class="float-right"
          v-model="source"
          icon="img:icons/Markdown-mark.svg"
          label="Markdown" />
      </div>

      <form @submit="submit">
        <q-input v-model="note.title" label="Title" filled />
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
          rows="10"
          v-model="note.content" />
        <textarea
          v-if="source"
          class="full-width edit-source-border"
          rows="10"
          style="border: 1px solid gray;" v-model="note.content" />

        <div class="q-mt-md">
          <q-btn color="grey" to="/" type="reset">Cancel</q-btn>
          <q-btn class="q-ml-sm" color="positive" type="submit"> Create </q-btn>
        </div>
      </form>
    </Container>
  </q-page>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue';
import { useLocalNotes } from 'src/helper';
import { useRouter } from 'vue-router';

import Editor from 'src/components/Editor.vue';
import Container from 'src/components/Container.vue';

export default defineComponent({
  components: { Container, Editor },
  name: 'PageNew',
  setup() {
    const router = useRouter();
    const notes = useLocalNotes();

    const note = reactive({
      title: '',
      description: '',
      content: '',
    });

    const submit = () => {
      console.log('submit');
      notes.value.unshift({
        ...note,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      router.push('/');

      note.title = '';
      note.description = '';
      note.content = '';
    };

    const source = ref(false);

    return { note, submit, source };
  },
});
</script>
