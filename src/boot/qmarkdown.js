// Outside of default export:
//  - Code here gets executed immediately,
//  - Good place for import statements,
//  - No access to router, Vuex store, ...

// import { boot } from 'quasar/wrappers';
import VuePlugin from '@quasar/quasar-ui-qmarkdown';
import '@quasar/quasar-ui-qmarkdown/dist/index.css';

// export default async ({ app, router, store }) => {
export default async ({ app }) => {
  console.log('qmarkdown:boot');
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

  app.use(VuePlugin);
};
