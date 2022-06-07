/* eslint-disable no-unused-vars */

import {
  ref,
  watch,
  onMounted,
  onUnmounted,
} from 'vue';

const useLocalStorage = (key, defaultValue) => {
  const value = ref(defaultValue);
  const read = () => {
    const v = window.localStorage.getItem(key);
    if (v != null) value.value = JSON.parse(v);
  };

  read();

  // onMounted(() => {
  //   console.log('onMounted');
  //   window.addEventListener('storage', () => {
  //     read('mounted');
  //   });
  // });

  // onUnmounted(() => {
  //   console.log('onUnmounted');
  //   window.removeEventListener('storage', () => {
  //     read('unmounted');
  //   });
  // });

  const write = () => {
    window.localStorage.setItem(key, JSON.stringify(value.value));
  };

  watch([value], write, { deep: true });

  return value;
};

export async function getGalleryNotes() {
  const index = await (await fetch('gallery/index.json')).json();

  /* eslint-disable-next-line no-restricted-syntax */
  for (const entry of index) {
    /* eslint-disable-next-line no-await-in-loop */ // https://eslint.org/docs/rules/no-await-in-loop
    const content = await (await fetch(`gallery/${entry.filename}`)).text();
    entry.content = content;
    entry.createdAt = Date.now();
    entry.updatedAt = entry.createdAt;
  }

  return index;
}

export const useLocalNotes = () => useLocalStorage('notes', []);

export async function deleteAllNotes() {
  const notes = await useLocalNotes();

  notes.value.splice(0);
}

export async function loadGalleryNotes() {
  const notes = useLocalNotes();

  const newNotes = await getGalleryNotes();

  notes.value.push(...newNotes);
}
