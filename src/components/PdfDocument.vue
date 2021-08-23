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
import { defineComponent, toRefs, onMounted, watch, computed, ref } from 'vue';
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

  setup(props) {
    const { url } = toRefs(props);

    let pdfDocumentProxy = ref({} as PDFDocumentProxy);
    let numPages = ref(0);
    let pageProxies = ref([] as PDFPageProxy[]);
    let pageOptions = ref([] as { label: string; value: number }[]);
    let pageVisible = ref([] as number[]);

    const loadPdf = async () => {
      console.log(`Loading PDF from '${url.value}'`);
      const loadingTask = getDocument(url.value);
      pdfDocumentProxy.value = await loadingTask.promise;

      numPages.value = pdfDocumentProxy.value.numPages;
      console.log('PAGES', numPages);

      pageProxies.value = await Promise.all(
        _.map(_.range(1, numPages.value + 1), (pageNum) => {
          pageOptions.value.push({
            label: `P${pageNum}`,
            value: pageNum,
          });
          pageVisible.value.push(pageNum);
          return pdfDocumentProxy.value.getPage(pageNum);
        })
      );
    };

    const visiblePages = computed(() => {
      return _.filter(pageProxies.value, (proxy) =>
        pageVisible.value.includes(proxy.pageNumber)
      );
    });

    const showAllPages = () => {
      pageVisible.value = _.range(1, pdfDocumentProxy.value.numPages + 1);
    };

    const hideAllPages = () => {
      pageVisible.value = [];
    };

    onMounted(loadPdf);
    watch(url, loadPdf);

    return {
      visiblePages,
      showAllPages,
      hideAllPages,
      pdfDocumentProxy,
      numPages,
      pageProxies,
      pageOptions,
      pageVisible,
    };
  },

  data() {
    return {
      scale: 1.0,
    };
  },
});
</script>

<style>
.pdf-document {
  background: aqua;
}
</style>
