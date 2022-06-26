// Outside of default export:
//  - Code here gets executed immediately,
//  - Good place for import statements,
//  - No access to router, Vuex store, ...

/* global smartdown */

import SQ from 'src/composables/SQ';

/* eslint-disable-next-line no-unused-vars */
import { useLocalNotes, getGalleryNotes } from 'src/composables/notes';

// export default async ({ app, router, store }) => {
export default async (/* { app } */) => {
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

  const calcHandlers = smartdown.defaultCalcHandlers;

  // This should be the ONLY place where the SQ function
  // is invoked
  window.SQ = SQ();

  function cardLoader(cardKey) {
    console.log('cardLoader', cardKey);

    window.SQ.loadCard(cardKey);
  }

  const linkRules = [
    {
      prefix: '/resources/',
      replace: '/gallery/resources/',
    },
  ];

  const baseURL = window.publicFolder || '/';

  const resultPromise = new Promise((resolve) => {
    smartdown.initialize(
      icons,
      baseURL,
      async () => {
        //
        // The following code is useful during debugging to auto-populate
        // the notes on app restart
        //

        if (process.env.GALLERY_DEV_MODE) {
          const notes = useLocalNotes();
          const newNotes = await getGalleryNotes();
          notes.value.splice(0, notes.value.length, ...newNotes);
        }

        resolve();
      },
      cardLoader,
      calcHandlers,
      linkRules,
    );
  });

  return resultPromise;
};
