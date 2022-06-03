<template>
  <q-page padding>
    <Container>
      <h3>
        <q-img
          src="/img/Octocat.png"
          style="max-width: 100px"
        />
        GitHub
      </h3>

      <hr>

      <h4
        v-if="loggedIn">
        Logged in as <b>{{ githubUsername }}</b>
      </h4>

      <q-btn
        v-if="loggedIn"
        @click="getGists"
        flat label="List Gists" color="primary"
      />

      <q-list bordered class="rounded-borders">
        <q-expansion-item
          expand-separator
          :label="gist.name"
          :caption="gist.owner.login"
          v-model="gist.expanded"
          v-for="(gist, idx) in gists"
          :key="idx">
          <q-card>
            <q-card-section>
              <q-img
                :src="gist.owner.avatar_url"
                style="max-width: 40px;"/>
              <a
                :href="gist.html_url"
                target="_blank">
                {{ gist.description }}
              </a>
              <table>
                <thead>
                  <tr>
                    <th>Filename</th>
                    <th>Language</th>
                    <th>URL</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(file, idx2) in gist.files"
                    :key="idx2">
                    <td>{{ file.filename }}</td>
                    <td>{{ file.language }}</td>
                    <td>
                      <a
                        :href="file.raw_url"
                        target="_blank">
                        {{ file.filename }}
                      </a>
                    </td>
                    <td>
                      <q-btn
                        @click="previewGistFile(gist, file)"
                        :label="`View`"
                        size="sm"
                        color="primary"
                      />
                      <q-btn
                        @click="importGistFile(gist, file)"
                        :label="`Import`"
                        size="sm"
                        color="primary"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>

      <hr>

      <q-btn
        v-if="loggedIn"
        @click="logout"
        flat label="Logout of GitHub" color="primary"
      />
      <q-btn
        v-else
        @click="getCredentials"
        flat label="Login to GitHub" color="primary"
      />

      <q-dialog v-model="preview" persistent>
        <q-card>
          <pre
            style="border: 1px solid lightblue;padding: 5px;"
            v-text="previewText"/>

          <q-card-actions align="right">
            <q-btn
              @click="cancelPreview"
              flat label="Done" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="confirm" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="check" color="primary" text-color="white" />
            <span class="q-ml-sm">Login to GitHub.</span>
          </q-card-section>

          <q-input
            v-model="githubUsername"
            label="Username" filled
          />
          <q-input
            v-model="githubToken"
            label="Token" filled
          />

          <q-card-actions align="right">
            <q-btn
              @click="cancel"
              flat label="Never Mind" color="primary" v-close-popup />
            <q-btn
              @click="login"
              flat label="Login to GitHub" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </Container>
  </q-page>
</template>

<script>
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  nextTick,
} from 'vue';
import { useRouter } from 'vue-router';
import { Octokit } from '@octokit/core';

import Container from 'src/components/Container.vue';
import { useLocalNotes } from 'src/helper';

export default defineComponent({
  components: { Container },
  name: 'GitHub',
  setup() {
    console.log('GitHub.setup()');
    const confirm = ref(false);

    const githubUsername = ref('OddCutOrb');
    const githubToken = ref('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');

    const loggedIn = ref(false);

    const gists = ref([]);
    const preview = ref(false);
    const previewText = ref('');
    const router = useRouter();

    const getGists = async () => {
      console.log('#getGists');

      const octokit = new Octokit({
        // auth: githubToken.value,
      });
      const githubGists = await octokit.request(`GET /users/${githubUsername.value}/gists`, {});
      console.log('githubGists', githubGists.data);

      // gists.value = githubGists.data;
      gists.value = githubGists.data.map((gist) => ({
        ...gist,
        expanded: true,
        name: gist.files[Object.keys(gist.files)[0]].filename,
      })).reverse();

      // const refinedGists = await githubGists.data.map(async (gist) => {
      //   const files = await gist.files;
      //   console.log('#files', files);
      //   const refinedFiles = await Object.keys(files).map(async (key) => {
      //     const file = await gist.files[key];
      //     const url = file.raw_url;
      //     console.log('#file/url', file, url);
      //     const text = await octokit.request(`GET ${url}`, {});
      //     file.text = text.data;
      //     console.log('#file.text', file.text);
      //     return file;
      //   });
      //   console.log('#refinedFiles', refinedFiles);
      //   return gist;
      // });
      // console.log('#refinedGists', refinedGists);
    };

    const loadGistFile = async (filename, url) => {
      console.log('#loadGistFile', filename, url);

      /*
        // For some reason, octokit.request fails in Safari and Firefox
        // with a 403 CORS-related error. Interestingly, Chrome appears
        // to work, but this may be a mistake in Chrome. In any case,
        // we can instead use the Fetch API (following these comments)
        // and it works in all browsers.
        const octokit = new Octokit({
          // auth: githubToken.value,
        });

        const text = await octokit.request(`GET ${url}`, {});
        file.text = text.data;
      */

      // This code works in all browsers
      const text = await fetch(url, {});
      return text.text();
    };

    const previewGistFile = async (gist, file) => {
      const gistName = gist.name;
      const { filename } = file;
      const url = file.raw_url;

      console.log('#previewGistFile', gistName, filename, url);

      const text = await loadGistFile(filename, url);
      previewText.value = await text;
      preview.value = true;
    };

    const importGistFile = async (gist, file) => {
      const gistName = gist.description;
      const { filename } = file;
      const url = file.raw_url;

      console.log('#importGistFile', gistName, filename, url);
      const content = await loadGistFile(filename, url);
      console.log('#import ', filename, content);

      const notes = useLocalNotes();
      const now = new Date();
      const title = `${gist.owner.login}: ${gistName}/${filename}`;
      const description = `GitHub Gist imported from ${gist.html_url}`;

      let newIndex = notes.value.length;
      let foundIndex;

      for (let index = 0; index < newIndex; index += 1) {
        if (notes.value[index].title === title) {
          foundIndex = index;
          break;
        }
      }

      if (foundIndex > -1) {
        newIndex = foundIndex;
        const foundNote = notes.value[foundIndex];
        foundNote.content = content;
      } else {
        const notex = reactive({
          title,
          description,
          content,
        });

        notes.value.push({
          ...notex,
          createdAt: now,
          updatedAt: now,
        });
      }

      router.push(`/note/${newIndex}`);
    };

    const cancel = () => {
      console.log('#cancel');
      confirm.value = false;
    };

    const cancelPreview = () => {
      preview.value = false;
    };

    const getCredentials = async () => {
      console.log('#getCredentials');
      confirm.value = true;
    };

    const login = async () => {
      console.log('#login', githubUsername.value, githubToken.value);
      confirm.value = false;
      loggedIn.value = true;
      await nextTick();

      await getGists();
    };

    const logout = async () => {
      console.log('#logout');
      loggedIn.value = false;
      gists.value = [];
    };

    onMounted(async () => {
      await login();
    });

    return {
      loggedIn,
      githubUsername,
      githubToken,
      gists,
      getCredentials,
      login,
      logout,
      getGists,
      previewGistFile,
      importGistFile,
      preview,
      cancelPreview,
      previewText,
      confirm,
      cancel,
    };
  },
});
</script>

<style>
table th {
  border-bottom: 1px solid black;
  padding: 0 20px !important;
}
table td {
  border-left: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
}
</style>
