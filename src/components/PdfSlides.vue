<template>
  <div class="row justify-center">
    <div class="column q-pa-md q-gutter-md">
      <q-btn
        color="secondary"
        label="First"
        :disable="isFirstPage"
        @click="firstPage"
      />
      <q-btn
        color="primary"
        label="Prev"
        :disable="!havePreviousPage"
        @click="previousPage"
      />
      <q-slider
        v-model="currentPage"
        :min="0"
        :max="numPages - 1"
        vertical
        label-always
        :label-value="currentPage + 1"
      />
      <q-btn
        color="primary"
        label="Next"
        :disable="!haveNextPage"
        @click="nextPage"
      />
      <q-btn
        color="secondary"
        label="Last"
        :disable="isLastPage"
        @click="lastPage"
      />
    </div>
    <pdf-page
      v-if="currentPageProxy"
      :scale="scale"
      :page-proxy="currentPageProxy"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, toRefs, onMounted } from 'vue';
import PdfPage from 'components/PdfPage.vue';
import usePdf from 'src/composables/usePdf';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'PdfSlides',

  components: { PdfPage },

  props: {
    url: { type: String, required: true },
  },

  setup(props) {
    const { url } = toRefs(props);
    const $q = useQuasar();
    const { loadPdf, pdfContainer } = usePdf();

    const currentPageIndex = ref(0);
    const currentPageProxy = computed(
      () => pdfContainer.pdfPageProxies[currentPageIndex.value]
    );
    const numPages = computed(() => pdfContainer.numPages);

    const contentSize = computed(() => {
      const windowHeight = $q.screen.height;
      const windowWidth = $q.screen.width;
      const rtn = { width: windowWidth, height: windowHeight - 50 };
      console.log('contentSize', rtn);
      return rtn;
    });

    const scale = computed(() => {
      if (numPages.value < 1) {
        return 1.0;
      }
      const viewport = currentPageProxy.value.getViewport({ scale: 1.0 });
      const { height: contentHeight, width: contentWidth } = contentSize.value;
      const verticalScale =
        (contentHeight / viewport.height) * window.devicePixelRatio;
      const horizontalScale =
        (contentWidth / viewport.width) * window.devicePixelRatio;
      const scale = Math.min(verticalScale, horizontalScale);
      console.log('scale', scale);
      return scale;
    });

    const havePreviousPage = computed(() => currentPageIndex.value > 0);
    const haveNextPage = computed(
      () => currentPageIndex.value < numPages.value - 1
    );
    const isFirstPage = computed(() => currentPageIndex.value === 0);
    const isLastPage = computed(
      () => currentPageIndex.value === numPages.value - 1
    );
    const previousPage = () => {
      currentPageIndex.value -= 1;
    };
    const nextPage = () => {
      currentPageIndex.value += 1;
    };
    const firstPage = () => (currentPageIndex.value = 0);
    const lastPage = () => (currentPageIndex.value = numPages.value - 1);

    onMounted(() => loadPdf(url.value));

    return {
      scale,
      currentPage: currentPageIndex,
      numPages,
      currentPageProxy,
      isFirstPage,
      isLastPage,
      havePreviousPage,
      haveNextPage,
      previousPage,
      nextPage,
      firstPage,
      lastPage,
    };
  },
});
</script>
