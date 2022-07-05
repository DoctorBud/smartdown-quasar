import {
  ref,
  watch,
} from 'vue';

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

export async function getGalleryNotes() {
  const index = await (await fetch('gallery/index.json')).json();

  /* eslint-disable-next-line no-restricted-syntax */
  for (const entry of index) {
    /* eslint-disable-next-line no-await-in-loop */ // https://eslint.org/docs/rules/no-await-in-loop
    const content = await (await fetch(`gallery/${entry.title}.md`)).text();
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

export async function addNote(noteData, notes = useLocalNotes()) {
  const result = {
    ...noteData,
    index: notes.value.length,
  };
  notes.value.push(result);

  return result;
}

export async function loadGalleryNotes() {
  const notes = useLocalNotes();
  const newNotes = await getGalleryNotes();

  newNotes.forEach((newNote) => {
    addNote(newNote, notes);
  });
}

export function lookupNoteByIndex(lookupIndex) {
  const notes = useLocalNotes().value;
  const result = notes.find((note, index) => index === lookupIndex);
  if (result) {
    result.index = lookupIndex;
  }

  return result;
}

export function lookupNoteByTitle(lookupTitle) {
  const notes = useLocalNotes().value;
  const result = notes.find((note) => note.title === lookupTitle);

  return result;
}

export function removeNoteByIndex(lookupIndex) {
  const notes = useLocalNotes().value;

  notes.splice(lookupIndex, 1);
}
