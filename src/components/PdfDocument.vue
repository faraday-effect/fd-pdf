<template>
  <div class="q-pa-md">
    <q-badge color="secondary"> Scale {{ scale }} </q-badge>
    <q-slider
      v-model="scale"
      :max="3.0"
      :min="0.25"
      :step="0.25"
      label
      markers
    />
  </div>
  <div class="q-pa-md">
    <q-option-group
      v-model="pageVisible"
      type="checkbox"
      :options="pageOptions"
      inline
      dense
    />
    {{ pageVisible }}
    <q-btn label="Show All" @click="showAllPages" />
    <q-btn label="Hide All" @click="hideAllPages" />
  </div>
  <div class="pdf-document row justify-center q-gutter-md">
    <pdf-page
      v-for="pageProxy in visiblePages"
      v-bind="{ pageProxy, scale }"
      :key="pageProxy.pageNumber"
    />
  </div>
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
  },

  data() {
    return {
      pdfDocumentProxy: {} as PDFDocumentProxy,
      pageProxies: [] as PDFPageProxy[],
      scale: 1.0,
      pageOptions: [] as { label: string; value: number }[],
      pageVisible: [] as number[],
    };
  },

  computed: {
    // FIXME - This _should_ return PDFPageProxy[], but that results in errors.
    visiblePages(): unknown[] {
      return _.filter(this.pageProxies, (proxy) =>
        this.pageVisible.includes(proxy.pageNumber)
      );
    },
  },

  methods: {
    async loadPDF(url: string) {
      console.log(`Loading PDF from '${url}'`);
      const loadingTask = getDocument(url);
      this.pdfDocumentProxy = await loadingTask.promise;

      const numPages = this.pdfDocumentProxy.numPages;
      console.log('PAGES', numPages);
      this.pageProxies = await Promise.all(
        _.map(_.range(1, numPages + 1), (pageNum) => {
          this.pageOptions.push({
            label: `P${pageNum}`,
            value: pageNum,
          });
          this.pageVisible.push(pageNum);
          return this.pdfDocumentProxy.getPage(pageNum);
        })
      );
    },

    showAllPages() {
      this.pageVisible = _.range(1, this.pdfDocumentProxy.numPages + 1);
    },

    hideAllPages() {
      this.pageVisible = [];
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

<style>
.pdf-document {
  background: aqua;
}
</style>
