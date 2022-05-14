// Outside of default export:
//  - Code here gets executed immediately,
//  - Good place for import statements,
//  - No access to router, Vuex store, ...

// // import { boot } from 'quasar/wrappers';
// import 'smartdown';
/* global smartdown */

// import '../../node_modules/smartdown/dist/lib/smartdown.css';
// import '../../node_modules/smartdown/dist/lib/fonts.css';

import smartdownEvents from 'src/composables/smartdownEvents.js';
import { useLocalNotes, getGalleryNotes } from 'src/helper';

// export default async ({ app, router, store }) => {
export default async (/* { app } */) => {
  console.log('smartdown:bootxx');

  // if (window.publicFolder) { // Electron
  //   try {
  //     // const helloResponse = await fetch('https://doctorbud.com/resume.html');
  //     const helloResponse = await fetch('file:///Users/bud/DoctorBud/smartdown-quasar/package.json');
  //     console.log('###helloResponse:', helloResponse.status);
  //     console.log('###helloResponse:', helloResponse.url);
  //     console.log('###helloResponse:', ...helloResponse.headers);
  //     const hello = await helloResponse.text();
  //     console.log('###hello:', hello);
  //   } catch (e) {
  //     console.log('###hello error:', e);
  //   }
  // }

  // Code here has access to the Object param above, connecting
  // with other parts of your app;

  // Code here can be async (use async/await or directly return a Promise);

  // Code here gets executed by Quasar CLI at the correct time in app's lifecycle:
  //  - we have a Router instantiated,
  //  - we have the optional Vuex store instantiated,
  //  - we have the root app's component ["app" prop in Object param] Object with
  //      which Quasar will instantiate the Vue app
  //      ("new Vue(app)" -- do NOT call this by yourself),
  //  - ...

  const icons = {
    // cloud: '/gallery/resources/cloud.jpg',
    // badge: '/gallery/resources/badge.svg',
    // hypercube: '/gallery/resources/Hypercube.svg',
    // StalactiteStalagmite: '/gallery/resources/StalactiteStalagmite.svg',
    // church: '/gallery/resources/church.svg',
    // lighthouse: '/gallery/resources/lighthouse.svg',
    // barn: '/gallery/resources/barn.svg',
    // 'medieval-gate': '/gallery/resources/medieval-gate.svg',
  };

  console.log('smartdown:boot0', window.smartdown);

  const calcHandlers = smartdown.defaultCalcHandlers;

  function cardLoader(cardKey) {
    console.log('cardLoader', cardKey);
    const eventBus = smartdownEvents();

    eventBus.loadCard(cardKey);
  }

  const linkRules = [
    {
      prefix: '/resources/',
      replace: '/gallery/resources/',
    },
  ];

  const baseURL = window.publicFolder || '/';

  // console.log('smartdown:boot1 baseURL', baseURL);

  const resultPromise = new Promise((resolve) => {
    // console.log('smartdown:boot2');
    smartdown.initialize(
      icons,
      baseURL,
      async () => {
        console.log('smartdown:boot3');
        const notes = useLocalNotes();

        const newNotes = await getGalleryNotes();

        notes.value.splice(0, notes.value.length, ...newNotes);

        resolve();
      },
      cardLoader,
      calcHandlers,
      linkRules,
    );
  });

  return resultPromise;
  // app.use(VuePlugin);
};
