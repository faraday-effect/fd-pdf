<template>
  <pdf-page
    v-for="pageProxy in pageProxies"
    v-bind="{ pageProxy, scale }"
    :key="pageProxy.pageNumber"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as _ from 'lodash';
import { getDocument } from 'pdfjs-dist';
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist/types/display/api';
import PdfPage from 'components/PdfPage.vue';

require('pdfjs-dist/webpack');

export default defineComponent({
  name: 'PdfDocument',
  components: { PdfPage },
  props: {
    url: { type: String, required: true },
    scale: { type: Number, required: true },
  },

  created() {
    console.log('CREATED PdfDocument');
  },
  mounted() {
    console.log('MOUNTED PdfDocument');
  },

  data() {
    return {
      pdfDocumentProxy: {} as PDFDocumentProxy,
      pageProxies: [] as PDFPageProxy[],
    };
  },

  methods: {
    async loadPDF(url: string) {
      console.log(`Loading PDF from '${url}'`);
      const loadingTask = getDocument(url);
      this.pdfDocumentProxy = await loadingTask.promise;
      const numPages = this.pdfDocumentProxy.numPages;
      this.pageProxies = await Promise.all(
        _.map(_.range(1, numPages), (pageNum) =>
          this.pdfDocumentProxy.getPage(pageNum)
        )
      );
    },
  },

  watch: {
    url: {
      async handler(newUrl) {
        await this.loadPDF(newUrl);
      },
      immediate: true,
    },
  },
});
</script>
