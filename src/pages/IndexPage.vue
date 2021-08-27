<template>
  <q-page>
    <pdf-slides v-if="showSlides" :url="url" />
    <pdf-thumbnails v-if="showThumbnails" :url="url" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PdfThumbnails from 'components/PdfThumbnails.vue';
import PdfSlides from 'components/PdfSlides.vue';
// import PdfDocument from 'components/PdfDocument.vue.tmp';

export default defineComponent({
  name: 'IndexPage',
  components: {
    PdfSlides,
    PdfThumbnails,
  },
  data() {
    return {
      // url: 'https://cdn.filestackcontent.com/5qOCEpKzQldoRsVatUPS',
      // url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
      url: 'http://192.168.4.65:3000/git-intro.slides.pdf',

      showThumbnails: false,
      showSlides: true,
      showDocument: false,
    };
  },
});
</script>
