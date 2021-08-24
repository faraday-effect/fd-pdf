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
import { defineComponent, ref, toRefs, computed } from 'vue';
import PdfPage from 'components/PdfPage.vue';
import 'pdfjs-dist/webpack';
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

    const { numPages, pageProxies } = usePdf(url);

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
      const viewport = pageProxies.value[0].getViewport({ scale: 1.0 });
      const { height: contentHeight, width: contentWidth } = contentSize.value;
      const verticalScale =
        (contentHeight / viewport.height) * window.devicePixelRatio;
      const horizontalScale =
        (contentWidth / viewport.width) * window.devicePixelRatio;
      const scale = Math.min(verticalScale, horizontalScale);
      console.log('scale', scale);
      return scale;
    });

    const currentPage = ref(0);
    const currentPageProxy = computed(
      () => pageProxies.value[currentPage.value]
    );
    const havePreviousPage = computed(() => currentPage.value > 0);
    const haveNextPage = computed(() => currentPage.value < numPages.value - 1);
    const isFirstPage = computed(() => currentPage.value === 0);
    const isLastPage = computed(() => currentPage.value === numPages.value - 1);
    const previousPage = () => {
      currentPage.value -= 1;
    };
    const nextPage = () => {
      currentPage.value += 1;
    };
    const firstPage = () => (currentPage.value = 0);
    const lastPage = () => (currentPage.value = numPages.value - 1);

    return {
      numPages,
      scale,
      currentPage,
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
