<template>
  <div>
    <div
      id="smartdown-outer-container"
      class="smartdown-outer-container smartdown-theme-chat">
      <div
        class="smartdown-container"
        id="smartdown-output"
        v-html="html">
      </div>
    </div>
  </div>
</template>

<script>
/* global smartdown */
import {
  ref,
  computed,
  watch,
  onMounted,
  nextTick,
} from 'vue';
import smartdownEvents from 'src/composables/smartdownEvents.js';

export default {
  props: {
    title: String,
    initInput: String,
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
      (currentItems) => {
        append.value = '';
        currentItems.forEach((currentItem) => {
          append.value = `${currentItem} `;
        });
      },
      // watch Options
      {
        lazy: false, // immediate: true
      },
    );

    watch(
      // getter
      () => todo.value.length,
      // callback
      (length) => {
        todoLength.value = length;
      },
      // watch Options
      {
        lazy: false, // immediate: true
      },
    );

    async function smartdownToHTML(text) {
      const resultPromise = new Promise((resolve) => {
        const outputDiv = document.createElement('div');
        smartdown.setSmartdown(text, outputDiv, () => {
          const smartdownHTML = outputDiv.innerHTML;
          resolve(smartdownHTML);
        });
      });

      return resultPromise;
    }

    const eventBus = smartdownEvents();
    watch(eventBus.cardToLoad, async () => {
      const cardPath = `gallery/${eventBus.cardToLoad.value}.md`;
      console.log('cardPath', cardPath);

      todo.value = await (await fetch(cardPath)).text();
      html.value = await smartdownToHTML(todo.value);
      await nextTick();
      const outputDiv = document.getElementById('smartdown-output');
      smartdown.setHome(todo.value, outputDiv, async () => {
        smartdown.startAutoplay(outputDiv);
      });
    });

    onMounted(async () => {
      html.value = await smartdownToHTML(todo.value);
      await nextTick();
      const outputDiv = document.getElementById('smartdown-output');
      smartdown.setHome(todo.value, outputDiv, async () => {
        smartdown.startAutoplay(outputDiv);
      });
    });

    return {
      todo,
      todoLength,
      items,
      itemsQuantity,
      append,
      html,
    };
  },
};
</script>
