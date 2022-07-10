import {
  ref,
  watch,
} from 'vue';
import { structuredClone } from 'core-js';

const useLocalStorage = (key, defaultValue) => {
  const value = ref(defaultValue);
  const read = () => {
    const v = window.localStorage.getItem(key);
    if (v != null) value.value = JSON.parse(v);
  };

  read();

  const write = () => {
    window.localStorage.setItem(key, JSON.stringify(value.value));
  };

  watch([value], write, { deep: true });

  return value;
};

let galleryNotes = null;
export async function prefetchGalleryNotes() {
  galleryNotes = await (await fetch('gallery/index.json')).json();

  /* eslint-disable-next-line no-restricted-syntax */
  for (const entry of galleryNotes) {
    /* eslint-disable-next-line no-await-in-loop */ // https://eslint.org/docs/rules/no-await-in-loop
    const content = await (await fetch(`gallery/${entry.title}.md`)).text();
    entry.content = content;
    entry.createdAt = Date.now();
    entry.updatedAt = entry.createdAt;
  }
}

export function lookupGalleryNote(title) {
  let result = null;

  galleryNotes.forEach((note) => {
    if (note.title === title) {
      result = structuredClone(note);
    }
  });

  return result;
}

export const useLocalNotes = () => useLocalStorage('notes', []);
const notes = useLocalNotes();

export function deleteAllNotes() {
  notes.value.splice(0);
}

export function addNote(noteData) {
  const result = noteData;
  notes.value.push(result);

  return result;
}

export function loadGalleryNotes() {
  const newNotes = structuredClone(galleryNotes);

  notes.value.push(...newNotes);
}

export function loadNoteByTitle(lookupTitle) {
  const result = notes.value.find((note) => note.title === lookupTitle);

  return result;
}

export function removeNoteByTitle(lookupTitle) {
  const result = notes.value.find((note) => note.title === lookupTitle);

  if (result) {
    const lookupIndex = notes.value.indexOf(result);
    notes.value.splice(lookupIndex, 1);
  } else {
    console.log('removeNoteByTitle() NOT FOUND', lookupTitle);
  }
}
