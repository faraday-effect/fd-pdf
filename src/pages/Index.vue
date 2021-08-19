<template>
  <q-page>
    <pdf-document v-bind="{ url, scale }" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PdfDocument from 'components/PdfDocument.vue';

export default defineComponent({
  name: 'IndexPage',

  components: { PdfDocument },

  created() {
    console.log('CREATED Index');
  },
  mounted() {
    console.log('MOUNTED Index');
  },

  data() {
    return {
      // url: 'https://cdn.filestackcontent.com/5qOCEpKzQldoRsVatUPS',
      // url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
      url: 'http://localhost:3000/git-intro.slides.pdf',
      scale: 2.0,
    };
  },
});
</script>
