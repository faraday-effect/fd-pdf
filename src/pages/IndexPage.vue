<template>
  <q-page>
    <pdf-document :url="url" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PdfDocument from 'components/PdfDocument.vue';

export default defineComponent({
  name: 'IndexPage',

  components: { PdfDocument },

  data() {
    return {
      // url: 'https://cdn.filestackcontent.com/5qOCEpKzQldoRsVatUPS',
      // url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
      url: 'http://localhost:3000/git-intro.slides.pdf',
    };
  },
});
</script>
