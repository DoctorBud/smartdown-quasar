import { ref } from 'vue';

const cardToLoad = ref('');
const toolbarTransparency = ref(0);
const toolbarVisibility = ref(true);
const toolbarFade = ref(false);

function setToolbarTransparency(transparency) {
  toolbarTransparency.value = transparency;
}

function setToolbarVisibility(visibility) {
  toolbarVisibility.value = visibility;
}

function setToolbarFade(fade) {
  toolbarFade.value = fade;
}

export default function SQ() {
  const loadCard = (cardKey) => {
    cardToLoad.value = null;
    window.setTimeout(() => {
      cardToLoad.value = cardKey;
    });
  };

  const version = '0.0.9';

  return {
    loadCard,
    cardToLoad,
    setToolbarTransparency,
    setToolbarVisibility,
    setToolbarFade,
    toolbarTransparency,
    toolbarVisibility,
    toolbarFade,
    version,
  };
}
