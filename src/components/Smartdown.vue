<template>
  <div>
    <div
      id="smartdown-outer-container"
      class="smartdown-outer-container">
      <div
        class="smartdown-container"
        id="smartdown-output"
        v-html="html">
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

import { ref, reactive, computed, watch, onBeforeMount, onMounted, onUpdated, nextTick } from 'vue';
import smartdownEvents from 'src/composables/smartdownEvents.js';

export default {
  props: {
    title: String,
    initInput: String
  },
  setup(props) {
    const html = ref('');
    const todo = ref(props.initInput);
    const todoLength = ref(0);

    const items = ref(['This', 'is']);
    const itemsQuantity = computed(() => items.value.length);
    const append = ref('');

    watch(
      // getter
      () => items.value,
      // callback
      (items, oldItems) => {
        append.value = '';
        items.forEach(item => {
          append.value += item + ' ';
        });
      },
      // watch Options
      {
        lazy: false // immediate: true
      }
    )

    watch(
      // getter
      () => todo.value.length,
      // callback
      (length, oldLength) => {
        todoLength.value = length;
      },
      // watch Options
      {
        lazy: false // immediate: true
      }
    )

    const eventBus = smartdownEvents();
    watch(eventBus.cardToLoad, async () => {
      const cardPath = `gallery/${eventBus.cardToLoad.value}.md`;
      console.log('cardPath', cardPath);

      todo.value = await (await fetch(cardPath)).text();
      html.value = await smartdownToHTML(todo.value);
      await nextTick();
      const outputDiv = document.getElementById('smartdown-output');
      const input1 = document.getElementById('INPUT1');
      smartdown.setHome(todo.value, outputDiv, async function() {
        smartdown.startAutoplay(outputDiv);
      });
    });

    const add = () => {
      if (todo.value) {
        items.value.push(todo.value);
        todo.value = '';
      }
    };

    const remove = index => {
      items.value.splice(index, 1);
    };

    onBeforeMount(() => {
      console.log('V3 beforeMount!');
    })

    function escape(htmlStr) {
      return htmlStr.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    async function smartdownToHTML(text) {
      const resultPromise = new Promise((resolve, reject) => {
        const outputDiv = document.createElement('div');
        console.log('###before smartdown.setSmartdown');
        smartdown.setSmartdown(text, outputDiv, function() {
          console.log('###after smartdown.setSmartdown');
          const smartdownHTML = outputDiv.innerHTML;
          resolve(smartdownHTML);
        });
      });

      return resultPromise;
    }

    onMounted(async () => {
      console.log('V3 onMounted!');
      html.value = await smartdownToHTML(todo.value);
      console.log('V3 before nextTick', smartdown.smartdownCells);
      await nextTick();
      console.log('V3 after nextTick', smartdown.smartdownCells);
      const outputDiv = document.getElementById('smartdown-output');
      console.log('###outputDiv', outputDiv);
      const input1 = document.getElementById('INPUT1');
      console.log('###input1', input1);
      smartdown.setHome(todo.value, outputDiv, async function() {
        console.log('V3 before autoPlay');
        smartdown.startAutoplay(outputDiv);
      });
    });

    return {
      todo,
      todoLength,
      items,
      itemsQuantity,
      append,
      add,
      remove,
      html,
    };
  }
};
</script>
