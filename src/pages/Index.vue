<template>
  <q-page padding>
    <Container>
      <NoteCard
        v-for="({ title, description }, idx) in notes.slice().reverse()"
        :key="idx"
        :title="title"
        :description="description"
        @click="router.push(`/note/${title}`)"
      />
      <div v-if="notes.length === 0">You have not created any notes.</div>
    </Container>
  </q-page>
</template>

<script>
import Container from 'src/components/Container.vue';
import NoteCard from 'src/components/NoteCard.vue';
import { useLocalNotes } from 'src/composables/notes';
import {
  defineComponent,
  onMounted,
  nextTick,
} from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  components: { NoteCard, Container },
  name: 'PageIndex',
  setup() {
    const notes = useLocalNotes();
    const router = useRouter();

    onMounted(async () => {
      await nextTick();
      router.push('/'); // '/note/OpenJSCAD');
    });

    return {
      router,
      notes,
    };
  },
});
</script>
