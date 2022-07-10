// https://www.thisdot.co/blog/provide-inject-api-with-vue-3

import {
  computed,
  inject,
  provide,
  reactive,
} from 'vue';

export const initStore = () => {
  // State
  const state = reactive({
    editMode: {
      editing: false,
      detailed: false,
      source: false,
    },
    note: null,
  });

  // Getters
  const getEditMode = computed(() => state.editMode);
  const getNote = computed(() => state.note);

  // Mutations
  const setEditMode = (editMode) => {
    state.editMode = editMode;
  };
  const setNote = (note) => {
    state.note = note;
  };

  // Actions
  const updateEditMode = (editMode) => {
    setEditMode(editMode);
  };
  const updateNote = (note) => {
    setNote(note);
  };

  provide('getEditMode', getEditMode);
  provide('updateEditMode', updateEditMode);
  provide('getNote', getNote);
  provide('updateNote', updateNote);
};

export const useStore = () => ({
  getEditMode: inject('getEditMode'),
  updateEditMode: inject('updateEditMode'),
  getNote: inject('getNote'),
  updateNote: inject('updateNote'),
});
