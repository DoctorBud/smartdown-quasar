<template>
  <q-layout
    class="background"
    view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-btn size="sm" color="grey" to="/" type="reset">Index</q-btn>

        <q-toolbar-title>
          Notes
        </q-toolbar-title>

        <q-btn
          size="xs"
          round
          color="positive" icon="add" to="/new"></q-btn>

        <div>v{{ packageVersion }}</div>
      </q-toolbar>
    </q-header>

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

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import ActionLink from 'components/ActionLink.vue';
import EssentialLink from 'components/EssentialLink.vue';

/* eslint-disable-next-line */
const packageVersion = process.env.packageVersion;

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
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev',
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework',
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev',
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev',
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev',
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev',
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev',
  },
];

import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'MainLayout',

  components: {
    ActionLink,
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      actionLinks,
      essentialLinks,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      packageVersion,
    };
  },
});
</script>
