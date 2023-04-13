<template>
  <prism-editor
    v-if="usePrism"
    class='my-prism-editor'
    v-model='currentValue'
    :highlight='highlighter'
    line-numbers
    ref="prism-editor">
  </prism-editor>
  <prism-editor
    v-else
    class='my-hljs-editor hljs'
    v-model='currentValue'
    :highlight='highlighter'
    line-numbers
    ref="prism-editor">
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

import hljs from 'highlight.js/lib/common';
import markdown from 'highlight.js/lib/languages/markdown';
import 'highlight.js/styles/base16/tomorrow-night.css';

hljs.registerLanguage('markdown', markdown);

export default {
  name: 'SourceEditor',
  props: ['modelValue', 'focused'],
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
  mounted() {
    setTimeout(() => {
      this.$refs['prism-editor'].$refs.textarea.focus();
    }, 1);
  },
  watch: {
    focused(newValue) {
      if (newValue) {
        this.$refs['prism-editor'].$refs.textarea.focus();
      }
    },
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
      const useDebugPrefixes = false;
      const topLevel = hljs.highlight(code, { language: 'markdown' });

      const element = document.createElement('div');
      element.innerHTML = topLevel.value;

      const codeElements = element.querySelectorAll('.hljs-code');
      codeElements.forEach((ce) => {
        const ceText = ce.innerText;
        if (ceText.startsWith('```') && ceText.endsWith('```')) {
          const trimmedBlock = ceText.slice(3, -3);
          let trimmedBlockHtml;
          let trimmedBlockLanguage;

          const languageKeywordSplit = trimmedBlock.split(/([\w\d]+)/);
          if (languageKeywordSplit[0] === '' && languageKeywordSplit[1] !== '') {
            [, trimmedBlockLanguage] = languageKeywordSplit;
            const hljsLanguage = hljs.getLanguage(trimmedBlockLanguage);
            if (!hljsLanguage) {
              // console.log('Unknown HLJS language', trimmedBlockLanguage);
              trimmedBlockLanguage = undefined;
            }
          }

          if (trimmedBlockLanguage) {
            trimmedBlockHtml = hljs.highlight(trimmedBlock, { language: trimmedBlockLanguage });
          } else {
            trimmedBlockHtml = hljs.highlightAuto(trimmedBlock);
          }
          /* eslint-disable-next-line no-underscore-dangle */
          const debugBlockPrefix = useDebugPrefixes ? `(?${trimmedBlockHtml._top.name})` : '';

          ce.innerHTML = `${debugBlockPrefix}\`\`\`${trimmedBlockHtml.value}\`\`\``;
        } else if (ceText.startsWith('`')) {
          const trimmedInline = ceText.slice(1, -1);
          const trimmedInlineHtml = hljs.highlightAuto(trimmedInline);
          /* eslint-disable-next-line no-underscore-dangle */
          const debugInlinePrefix = useDebugPrefixes ? `(?${trimmedInlineHtml._top.name})` : '';

          ce.innerHTML = `${debugInlinePrefix}\`${trimmedInlineHtml.value}\``;
        } else {
          console.log('other', ceText);
          const debugOtherPrefix = '(?)';
          ce.innerHTML = `${debugOtherPrefix}\`${ce.innerHTML}\``;
        }
      });
      return element.innerHTML;
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
    font-family: Consolas, Monaco, monospace;
    font-size: 14px;
    line-height: 1.25em;
    padding: 5px;
    background-color: darkslateblue;
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
