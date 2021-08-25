<template>
  <div class="q-pa-md">
    <q-badge color="secondary"> Scale {{ scale }} </q-badge>
    <q-slider v-model="scale" :max="7.0" :min="1.0" :step="1.0" label markers />
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
import PdfPage from 'components/PdfPage.vue';
import usePdf from 'src/composables/usePdf';

export default defineComponent({
  name: 'PdfDocument',

  components: { PdfPage },

  props: {
    url: { type: String, required: true },
  },

  data() {
    return {
      scale: 1.0,
    };
  },

  setup(props) {
    const { url } = toRefs(props);

    const { pdfDocumentProxy, numPages, pageProxies } = usePdf(url);

    let pageOptions = ref([] as { label: string; value: number }[]);
    let pageVisible = ref([] as number[]);

    const createControls = () => {
      console.log('Creating controls');
      _.map(pageProxies.value, (pageProxy) => {
        const pageNum = pageProxy.pageNumber;
        pageOptions.value.push({
          label: `P${pageNum}`,
          value: pageNum,
        });
        pageVisible.value.push(pageNum);
      });
      console.log('Created %d controls', pageProxies.value.length);
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

    onMounted(createControls);
    watch(pageProxies, createControls);

    return {
      pdfDocumentProxy,
      numPages,
      pageProxies,
      pageOptions,
      pageVisible,
      visiblePages,
      showAllPages,
      hideAllPages,
    };
  },
});
</script>

<style>
.pdf-document {
  background: aqua;
}
</style>
