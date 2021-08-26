<template>
  <q-page>
    <pdf-document v-if="showDocument" :url="url" />
    <pdf-thumbnails v-if="showThumbnails" :url="url" />
    <pdf-slides v-if="showSlides" :url="url" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PdfSlides from 'components/PdfSlides.vue';
import PdfThumbnails from 'components/PdfThumbnails.vue';
import PdfDocument from 'components/PdfDocument.vue';

export default defineComponent({
  name: 'IndexPage',
  components: { PdfDocument, PdfThumbnails, PdfSlides },
  data() {
    return {
      // url: 'https://cdn.filestackcontent.com/5qOCEpKzQldoRsVatUPS',
      // url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
      url: 'http://192.168.4.65:3000/git-intro.slides.pdf',

      showDocument: true,
      showThumbnails: true,
      showSlides: true,
    };
  },
});
</script>
