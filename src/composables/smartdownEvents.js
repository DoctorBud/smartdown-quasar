import { ref } from 'vue';

const cardToLoad = ref('');

export default function smartdownEvents() {
  const loadCard = (cardKey) => {
    cardToLoad.value = cardKey;
    console.log('loadCard', cardKey, cardToLoad.value);
  };

  return {
    cardToLoad,
    loadCard,
  };
}
