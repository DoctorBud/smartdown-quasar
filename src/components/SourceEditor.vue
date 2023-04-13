<template>
  <MonacoEditor
    theme="hc-black"
    :options="options"
    language="markdown"
    :width="800"
    :height="800"
    :diffEditor="false"
    :original="original"
    v-model:value="value"
    @editorDidMount="editorDidMount"
  >
  </MonacoEditor>
</template>

<script>
import MonacoEditor from 'monaco-editor-vue3';

export default {
  name: 'SourceEditor',
  props: ['modelValue', 'focused'],
  data() {
    return {
      value: '',
      original: '',
      // https://microsoft.github.io/monaco-editor/docs.html#interfaces/editor.IEditorOptions.html
      options: {
        minimap: {
          enabled: false,
        },
        wordWrap: true,
        colorDecorators: true,
        // lineHeight: 20,
        tabSize: 2,
        automaticLayout: true,
        useTabStops: true,
        renderWhitespace: false,
        stickyTabStops: false,
        insertSpaces: true,
        formattingOptions: {
          tabSize: 4,
          insertSpaces: true,
        },
      },
    };
  },
  components: {
    MonacoEditor,
  },
  created() {
    this.value = this.modelValue;
    this.original = this.modelValue;
  },
  watch: {
    // focused(newValue) {
    //   if (newValue) {
    //     this.$refs['prism-editor'].$refs.textarea.focus();
    //   }
    // },
    currentValue(newValue) {
      console.log('currentValue', newValue, this.value);
      if (newValue !== this.value) {
        this.value = newValue;
        this.$emit('update:modelValue', this.value);
      }
    },
  },
  methods: {
    editorDidMount(editor) {
      const model = editor.getModel();
      const options = this.options.formattingOptions;

      model.updateOptions(options);

      window.editor = editor;

      editor.onDidChangeModelContent(() => {
        this.$emit('update:modelValue', this.value);
      });
    },
  },
};
</script>

<style>
  .monaco-editor {
  }

  /* optional class for removing the outline */
  .prism-editor__textarea:focus {
    outline: none;
  }
</style>
