<template>
  <q-page>
    <pdf-thumbnails :url="url" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PdfThumbnails from 'components/PdfThumbnails.vue';

export default defineComponent({
  name: 'IndexPage',
  components: { PdfThumbnails },
  data() {
    return {
      // url: 'https://cdn.filestackcontent.com/5qOCEpKzQldoRsVatUPS',
      // url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
      url: 'http://192.168.4.65:3000/git-intro.slides.pdf',
    };
  },
});
</script>
