/* eslint-disable */

// https://www.thisdot.co/blog/provide-inject-api-with-vue-3

import { computed, inject, provide, reactive } from "vue";

export const initStore = () => {
  // State
  const state = reactive({
    name: "Bob Day",
    email: "bob@martianmovers.com",
    note: null,
    editMode: {
      editing: true,
      detailed: false,
      source: true,
    },
  });

  // Getters
  const getUsername = computed(() => state.name);
  const getEmail = computed(() => state.email);
  const getNote = computed(() => state.note);
  const getEditMode = computed(() => state.editMode);

  // Mutations
  const setUsername = (name) => {
    state.name = name;
  };
  const setEmail = (email) => {
    state.email = email;
  };
  const setNote = (note) => {
    state.note = note;
  };
  const setEditMode = (editMode) => {
    state.editMode = editMode;
  };

  // Actions
  const updateUsername = (name) => {
    setUsername(name);
  };
  const updateEmail = (email) => {
    setEmail(email);
  };
  const updateNote = (note) => {
    setNote(note);
  };
  const updateEditMode = (editMode) => {
    setEditMode(editMode);
  };

  provide("getUsername", getUsername);
  provide("getEmail", getEmail);
  provide("getEditMode", getEditMode);
  provide("getNote", getNote);
  provide("updateUsername", updateUsername);
  provide("updateEmail", updateEmail);
  provide("updateNote", updateNote);
  provide("updateEditMode", updateEditMode);
};

export const useStore = () => ({
  getUsername: inject("getUsername"),
  getEmail: inject("getEmail"),
  getNote: inject("getNote"),
  getEditMode: inject("getEditMode"),
  updateUsername: inject("updateUsername"),
  updateEmail: inject("updateEmail"),
  updateNote: inject("updateNote"),
  updateEditMode: inject("updateEditMode"),
});
