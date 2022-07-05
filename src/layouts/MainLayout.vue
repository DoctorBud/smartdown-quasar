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
        <DrawerItem
          v-for="link in links"
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

    <q-footer
      class="bg-grey-8 text-white"
      :class="{
        'toolbar-transparent': SQ.toolbarTransparency.value,
        'toolbar-hidden': !SQ.toolbarVisibility.value,
        'toolbar-fade': SQ.toolbarFade.value
      }">
      <q-slide-transition
        v-if="note">
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
      <q-toolbar
        @dblclick="goToDashboard">
        <q-btn size="sm"
          @click="toggleLeftDrawer">
          <q-avatar size="30px">
            <img src="img/smartdown-120x120.png">
          </q-avatar>
        </q-btn>

        <q-space />

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

        <q-file
          v-if="!note"
          v-model="uploadedNote"
          hide-bottom-space
          dense
          item-aligned
          dark
          outlined
          style="max-height:48px; max-width:80px;"
          @update:model-value="uploadedNoteChanged()">
          <q-avatar
            size="sm"
            style="margin-top: 7px !important;"
            icon="file_upload"
            color="primary"
            text-color="white"/>
        </q-file>

        &nbsp;&nbsp;&nbsp;

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
/* global SQ */

import DrawerItem from 'components/DrawerItem.vue';

import { useRoute, useRouter } from 'vue-router';

import {
  defineComponent,
  ref,
  computed,
  reactive,
  watch,
} from 'vue';
import { useStore } from 'src/composables/store';
import {
  lookupNoteByTitle,
  removeNoteByIndex,
  addNote,
} from 'src/composables/notes';

export default defineComponent({
  name: 'MainLayout',

  components: {
    DrawerItem,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const route = useRoute();
    const path = computed(() => route.path);
    const store = useStore();
    const uploadedNote = ref(null);
    const uploadedNoteText = ref('');

    // const note = computed(() => store.getNote.value);
    const note = computed(() => (route.path.startsWith('/note/')
      ? lookupNoteByTitle(route.params.id)
      : null));
    const editMode = computed({
      get: () => store.getEditMode.value,
      set: store.updateEditMode,
    });

    //
    // This seems hacky, but it gets the job done:
    //  If the user clicks the Markdown toggle to ON,
    //  then enable Edit mode.
    // This article:
    //  https://www.netlify.com/blog/2021/01/29/deep-dive-into-the-vue-composition-apis-watch-method/
    // suggests (look for 'Nested objects/arrays') using lodash to clone objects so that old vs new is detectable.
    // The below hack is way simpler.
    //
    let oldSource = editMode.value.source;
    watch(
      editMode,
      () => {
        if (editMode.value.source && !oldSource) {
          editMode.value.editing = true;
        }
        oldSource = editMode.value.source;
      },
      { deep: true },
    );

    const confirm = ref(false);
    const router = useRouter();
    const remove = () => {
      removeNoteByIndex(parseInt(route.params.id, 10));
      router.push('/');
    };

    const newNote = async () => {
      const now = new Date();
      const nowTitle = now.toLocaleString('en-us');

      const notex = reactive({
        title: nowTitle,
        description: '',
        content: '',
      });

      const noteData = {
        ...notex,
        createdAt: now,
        updatedAt: now,
      };
      await addNote(noteData);

      editMode.value.detailed = true;
      editMode.value.editing = true;
      router.push(`/note/${noteData.title}`);
    };

    const uploadedNoteChanged = async () => {
      const blob = new Blob([uploadedNote.value]);

      const content = await blob.text();
      uploadedNoteText.value = content;

      // const notes = useLocalNotes();
      const now = new Date();
      const nowTitle = now.toLocaleString('en-us');

      const noteName = uploadedNote.value.name;
      const noteNameWithoutExtension = noteName.endsWith('.md')
        ? noteName.split('.').slice(0, -1).join('.')
        : noteName;
      const title = `${noteNameWithoutExtension.replaceAll('__', '/')}`;
      const description = `File imported from ${uploadedNote.value.name} at ${nowTitle}`;
      uploadedNote.value = null;

      const notex = reactive({
        title,
        description,
        content,
      });

      await addNote(notex);

      editMode.value.editing = false;
      editMode.value.detailed = true;
      router.push(`/note/${notex.title}`);
    };

    const goToExport = () => {
      const id = note.value.index;

      if (id >= 0) {
        router.push(`/export/${note.value.title}`);
      } else {
        router.push('/export/all');
      }
    };

    const goToDashboard = () => {
      router.push('/');
    };

    const links = [
      {
        title: 'Notes',
        caption: 'List of Notes',
        icon: 'dashboard',
        to: '/',
      },
      {
        title: 'Export',
        caption: 'Export',
        icon: 'file_download',
        action: goToExport,
      },
      {
        title: 'Reset',
        caption: 'Reset with Sample Docs',
        icon: 'clear_all',
        to: '/reset',
      },
      {
        title: 'GitHub',
        caption: 'Login to GitHub',
        icon: 'img:img/Octocat.png',
        to: '/github',
      },
      {
        title: 'About',
        caption: 'About this app',
        icon: 'info',
        to: '/about',
      },
      {
        title: 'Smartdown Site',
        caption: 'smartdown.io',
        icon: 'img:img/favicon-128x128.png',
        link: 'https://smartdown.io',
      },
      {
        title: 'Smartdown Gallery',
        caption: 'smartdown.site',
        icon: 'img:img/favicon-128x128.png',
        link: 'https://smartdown.site',
      },
      {
        title: 'Smartdown GitHub',
        caption: 'github.com/smartdown',
        icon: 'code',
        link: 'https://github.com/smartdown',
      },
    ];

    watch(
      () => route.path,
      async () => {
        if (!route.path.startsWith('/note/')) {
          editMode.value.editing = false;
          editMode.value.detailed = false;
        }
        SQ.setToolbarVisibility(true);
        SQ.setToolbarTransparency(false);
        SQ.setToolbarFade(false);
        const url = new URL(window.location.href);
        window.history.replaceState(window.history.state, null, url);
      },
    );

    return {
      path,
      links,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      note,
      editMode,
      confirm,
      remove,
      newNote,
      goToDashboard,
      goToExport,
      uploadedNote,
      uploadedNoteText,
      uploadedNoteChanged,
      SQ,
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
