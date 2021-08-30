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
  watch,
} from 'vue';
import PdfPage from 'components/PdfPage.vue';
import { PdfAsLoaded, PdfDocAsDrawn, usePdf } from 'src/composables/usePdf';
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

    const pdfAsLoaded = ref<PdfAsLoaded>();
    const pdfDocAsDrawn = reactive<PdfDocAsDrawn>({
      scale: -Infinity,
      pages: [],
    });
    const numPages = computed(() => pdfDocAsDrawn.pages.length);
    const isDocLoaded = computed(() => numPages.value > 0);

    const currentPageIndex = ref(0);
    const updatePageIndex = (newIndex: number) => {
      currentPageIndex.value = newIndex;
    };

    const currentPage = computed(
      () => pdfDocAsDrawn.pages[currentPageIndex.value]
    );
    const currentCanvas = computed(() =>
      isDocLoaded.value ? currentPage.value.canvas : null
    );

    const contentSize = computed(() => {
      const windowHeight = $q.screen.height;
      const windowWidth = $q.screen.width;
      return {
        width: windowWidth,
        height: windowHeight - 50,
      };
    });

    const scale = ref(1.0);
    const calculateScale = () => {
      if (!pdfAsLoaded.value) {
        console.error('No loaded PDF');
        return;
      }
      const viewport = pdfAsLoaded.value.pdfPageProxies[
        currentPageIndex.value
      ].getViewport({ scale: 1.0 });
      const { height: contentHeight, width: contentWidth } = contentSize.value;
      const verticalScale =
        (contentHeight / viewport.height) * window.devicePixelRatio;
      const horizontalScale =
        (contentWidth / viewport.width) * window.devicePixelRatio;
      scale.value = Math.min(verticalScale, horizontalScale);
      console.log(`Calculated scale of ${scale.value}`);
    };

    onMounted(() => {
      loadPdf(url.value)
        .then((pdf) => {
          console.log('PDF Loaded');
          pdfAsLoaded.value = pdf;
        })
        .catch((error) => {
          throw error;
        });
    });

    const scaleAndDrawAllPages = () => {
      if (pdfAsLoaded.value) {
        calculateScale();
        drawAllPages(pdfAsLoaded.value, scale.value)
          .then((asDrawn) => {
            pdfDocAsDrawn.scale = asDrawn.scale;
            pdfDocAsDrawn.pages = asDrawn.pages;
          })
          .catch((error) => {
            throw error;
          });
      }
    };

    watch([pdfAsLoaded, contentSize], () => {
      scaleAndDrawAllPages();
    });

    return {
      currentPageIndex,
      currentCanvas,
      numPages,
      updatePageIndex,
      pdfDocAsDrawn,
    };
  },
});
</script>
