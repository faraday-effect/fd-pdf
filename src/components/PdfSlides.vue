<template>
  <div class="row justify-center">
    <div class="column">
      <q-toggle label="Show Thumbnails" v-model="thumbnailsVisible" />
      <pdf-thumbnails-dialog
        v-model="thumbnailsVisible"
        :pdf-doc-as-drawn="pdfDocAsDrawn"
      />
      Index: {{ currentPageIndex }}, Count: {{ numPages }}
    </div>
    <pdf-page-picker :num-pages="numPages" @pageIndex="updatePageIndex" />
    <pdf-page v-if="currentCanvas" :canvas="currentCanvas" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  toRefs,
  onMounted,
  reactive,
} from 'vue';
import PdfPage from 'components/PdfPage.vue';
import { PdfDocAsDrawn, usePdf } from 'src/composables/usePdf';
import { useQuasar } from 'quasar';
import PdfPagePicker from 'components/PdfPagePicker.vue';
import PdfThumbnailsDialog from 'components/PdfThumbnailsDialog.vue';

export default defineComponent({
  name: 'PdfSlides',

  components: { PdfThumbnailsDialog, PdfPagePicker, PdfPage },

  props: {
    url: { type: String, required: true },
  },

  data() {
    return {
      thumbnailsVisible: false,
    };
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

    const pdfDocAsDrawn = reactive<PdfDocAsDrawn>({
      scale: -Infinity,
      pages: [],
    });
    const numPages = computed(() => pdfDocAsDrawn.pages.length);
    const currentCanvas = computed(() => {
      const idx = currentPageIndex.value;
      console.log('IDX', idx, 'NUM PAGES', numPages.value);
      if (numPages.value < 1) {
        console.error('NO PAGES');
        return null;
      } else {
        const page = pdfDocAsDrawn.pages[currentPageIndex.value];
        console.log('NUM', page.pageNumber, 'CANVAS', page.canvas);
        return page.canvas;
      }
    });

    onMounted(() => {
      loadPdf(url.value)
        .then((pdfAsLoaded) => drawAllPages(pdfAsLoaded, scale.value))
        .then((asDrawn) => {
          pdfDocAsDrawn.scale = asDrawn.scale;
          pdfDocAsDrawn.pages = asDrawn.pages;
        })
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
      pdfDocAsDrawn,
    };
  },
});
</script>
