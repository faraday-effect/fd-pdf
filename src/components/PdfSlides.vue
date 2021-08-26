<template>
  <div class="row justify-center">
    Index: {{ currentPageIndex }}, Count: {{ numPages }}
    <pdf-page-picker :num-pages="numPages" @pageIndex="updatePageIndex" />
    <pdf-page v-if="currentCanvas" :canvas="currentCanvas" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, toRefs, onMounted } from 'vue';
import PdfPage from 'components/PdfPage.vue';
import { PdfDocAsDrawn, usePdf } from 'src/composables/usePdf';
import { useQuasar } from 'quasar';
import PdfPagePicker from 'components/PdfPagePicker.vue';

export default defineComponent({
  name: 'PdfSlides',

  components: { PdfPagePicker, PdfPage },

  props: {
    url: { type: String, required: true },
  },

  setup(props) {
    const { url } = toRefs(props);
    const $q = useQuasar();
    const { loadPdf, drawAllPages } = usePdf();

    const currentPageIndex = ref(0);
    const updatePageIndex = (newIndex: number) => {
      console.log('Update index to', newIndex);
      currentPageIndex.value = newIndex;
    };

    const contentSize = computed(() => {
      const windowHeight = $q.screen.height;
      const windowWidth = $q.screen.width;
      return {
        width: windowWidth,
        height: windowHeight - 50,
      };
    });

    const scale = computed(() => {
      if (!currentCanvas.value) {
        return 1.0;
      }
      const { height: contentHeight, width: contentWidth } = contentSize.value;
      const verticalScale =
        (contentHeight / currentCanvas.value.height) * window.devicePixelRatio;
      const horizontalScale =
        (contentWidth / currentCanvas.value.width) * window.devicePixelRatio;
      const scale = Math.min(verticalScale, horizontalScale);
      console.log('scale', scale);
      return scale;
    });

    const pdfDocAsDrawn = ref<PdfDocAsDrawn>({
      scale: -Infinity,
      pages: [],
    });
    const numPages = computed(() => pdfDocAsDrawn.value.pages.length);
    const currentCanvas = computed(() =>
      numPages.value > 0
        ? pdfDocAsDrawn.value.pages[currentPageIndex.value].canvas
        : null
    );

    onMounted(() => {
      loadPdf(url.value)
        .then((pdfAsLoaded) => drawAllPages(pdfAsLoaded, scale.value))
        .then((asDrawn) => (pdfDocAsDrawn.value = asDrawn))
        .catch((error) => {
          throw error;
        });
    });

    return {
      currentPageIndex,
      currentCanvas,
      numPages,
      scale,
      updatePageIndex,
    };
  },
});
</script>
