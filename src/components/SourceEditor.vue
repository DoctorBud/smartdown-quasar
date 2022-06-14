<template>
  <prism-editor
    v-if="usePrism"
    class='my-prism-editor'
    v-model='currentValue'
    :highlight='highlighter'
    line-numbers>
  </prism-editor>
  <prism-editor
    v-else
    class='my-hljs-editor hljs'
    v-model='currentValue'
    :highlight='highlighter'
    line-numbers>
  </prism-editor>
</template>

<script>
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css';

import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-markdown';
import 'prismjs/themes/prism-tomorrow.css';

import hljs from 'highlight.js';
import 'highlight.js/styles/base16/tomorrow-night.css';

export default {
  name: 'SourceEditor',
  props: ['modelValue'],
  data() {
    return {
      lastValue: '',
      currentValue: '',
      usePrism: false,
    };
  },
  created() {
    this.lastValue = this.modelValue;
    this.currentValue = this.modelValue;
  },
  watch: {
    currentValue(newValue) {
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
    prismHighlight(code) {
      return highlight(code, languages.markdown);
    },
    hljsHighlight(code) {
      return hljs.highlight(code, { language: 'markdown' }).value;
      // return hljs.highlightAuto(code).value;
    },
    highlighter(code) {
      return this.usePrism
        ? this.prismHighlight(code)
        : this.hljsHighlight(code);
    },
  },
};
</script>

<style>
  .my-prism-editor {
    background: #2e2e2e;
    color: #ccc;
    font-family: Consolas, Monaco, monospace;
    font-size: 14px;
    line-height: 1.5em;
    padding: 5px;
  }

  .my-hljs-editor {
    xfont-family: Consolas, Monaco, monospace;
    xfont-size: 14px;
    xline-height: 1.5em;
    padding: 5px;
  }

  /*
    Hacks to align vue-prism-editor's textarea with its pre.
    The problem is that the textarea expects its text
    to be 'normal' font-weight and style, but the syntax
    highlighters (Prism and HighlightJS) choose to change
    the weight and style of certain text (e.g., italicizing the '#' used to define markdown headings).

    So... We disable the weight/style changes and things
    seem to work.
   */
  .hljs-section {
    font-weight: normal;
  }

  .token.important,
  .token.bold {
    font-weight: normal;
  }
  .token.italic {
    font-style: normal;
  }

  /* optional class for removing the outline */
  .prism-editor__textarea:focus {
    outline: none;
  }
</style>
