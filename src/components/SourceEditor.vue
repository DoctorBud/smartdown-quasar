<template>
  <prism-editor class='my-editor' v-model='currentValue' :highlight='highlighter' line-numbers>
  </prism-editor>
</template>

<script>
// import Prism Editor
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css'; // import the styles somewhere

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css'; // import syntax highlighting styles

export default {
  name: 'SourceEditor',
  props: ['modelValue'],
  data() {
    return {
      lastValue: '',
      currentValue: '',
    };
  },
  created() {
    this.lastValue = this.modelValue;
    this.currentValue = this.modelValue;
  },
  watch: {
    currentValue(newValue) {
      console.log('currentValue', newValue, this.currentValue);
      if (newValue !== this.lastValue) {
        this.lastValue = newValue;
        this.$emit('update:modelValue', this.lastValue);
      }
    },
  },
  components: {
    PrismEditor,
  },
  methods: {
    highlighter(code) {
      return highlight(code, languages.js);
    },
  },
};
</script>

<style>
  /* required class */
  .my-editor {
    background: #2d2d2d;
    color: #ccc;

    /* you must provide font-family font-size line-height. Example: */
    font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
    font-size: 14px;
    line-height: 1.5;
    padding: 5px;
  }

  /* optional class for removing the outline */
  .prism-editor__textarea:focus {
    outline: none;
  }
</style>
