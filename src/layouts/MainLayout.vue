<template>
  <q-layout
    class="background"
    view="hHh lpR fFf">

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      behavior = "mobile"
    >
      <q-list>
        <ActionLink
          v-for="link in actionLinks"
          :key="link.title"
          v-bind="link"
        />

        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

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

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated
      class="bg-grey-8 text-white"
      style="xheight:45px;">

      <q-slide-transition v-if="note">
        <div v-show="editMode.detailed" class="details">
          <div
            v-if="editMode.editing">
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
              type="textarea"
            />
          </div>
        </div>
      </q-slide-transition>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          size="sm"
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <q-btn size="sm" to="/" type="reset">
            <q-avatar size="30px">
              <img src="img/smartdown-120x120.png">
            </q-avatar>
          </q-btn>
        </q-toolbar-title>

        <q-toggle
          v-if="note"
          size="sm"
          v-model="editMode.editing"
          icon="edit" />

        <q-toggle
          v-if="note"
          :disabled="!editMode.editing"
          size="sm"
          v-model="editMode.source"
          icon="img:icons/Markdown-mark.svg" />

        <q-toggle
          v-if="note"
          size="sm"
          v-model="editMode.detailed"
          icon="info" />

        <q-btn
          v-if="note"
          class="q-mr-lg"
          size="sm"
          round
          color="red"
          icon="delete"
          @click="confirm = true"
        />

        <q-btn
          v-if="path === '/'"
          size="sm"
          round
          color="positive" icon="add"
          @click="newNote"
          >
        </q-btn>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import ActionLink from 'components/ActionLink.vue';
import EssentialLink from 'components/EssentialLink.vue';

const actionLinks = [
  {
    title: 'About',
    caption: 'About this app',
    icon: 'info',
    to: '/about',
  },
  {
    title: 'Reset',
    caption: 'Reset with Sample Docs',
    icon: 'clear_all',
    to: '/reset',
  },
];

const essentialLinks = [
  {
    title: 'Smartdown Site',
    caption: 'smartdown.io',
    icon: 'img:/img/favicon-128x128.png',
    link: 'https://smartdown.io',
  },
  {
    title: 'Smartdown Gallery',
    caption: 'smartdown.site',
    icon: 'img:/img/favicon-128x128.png',
    link: 'https://smartdown.site',
  },
  {
    title: 'Github',
    caption: 'github.com/smartdown',
    icon: 'code',
    link: 'https://github.com/smartdown',
  },
];

import { useRoute, useRouter } from 'vue-router';

import {
  defineComponent,
  ref,
  computed,
  reactive,
} from 'vue';
import { useStore } from 'src/composables/store';
import { useLocalNotes } from 'src/helper';

export default defineComponent({
  name: 'MainLayout',

  components: {
    ActionLink,
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const route = useRoute();
    const path = computed(() => route.path);
    const store = useStore();

    const note = computed({
      get: () => store.getNote.value,
      set: store.updateNote,
    });
    const editMode = computed({
      get: () => store.getEditMode.value,
      set: store.updateEditMode,
    });

    const notes = useLocalNotes();
    const noteId = computed(() => parseInt(route.params.id, 10));
    const confirm = ref(false);
    const router = useRouter();
    const remove = () => {
      notes.value.splice(noteId.value, 1);
      router.push('/');
    };

    const newNote = () => {
      const now = new Date();
      const nowTitle = now.toLocaleString('en-us');

      const notex = reactive({
        title: nowTitle,
        description: '',
        content: '',
      });

      const idx = notes.value.length;

      notes.value.push({
        ...notex,
        createdAt: now,
        updatedAt: now,
      });

      console.log('route', `/note/${idx}`);
      editMode.value.detailed = true;
      editMode.value.editing = true;
      router.push(`/note/${idx}`);
    };

    return {
      path,
      actionLinks,
      essentialLinks,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      note,
      editMode,
      confirm,
      remove,
      newNote,
    };
  },
});
</script>

<style>
.details {
  background: ghostwhite;
  position: fixed;
  margin: 0px;
  padding: 0px 5px;
  width: 100%;
  bottom:  50px;
}

.q-field--filled
  .q-field__control:before {
  border-radius: 5px;
  border: 1px solid darkgray !important;
}

.details textarea {
  resize: none !important;
}
</style>
