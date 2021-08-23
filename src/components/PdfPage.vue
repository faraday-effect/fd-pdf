<template>
  <canvas v-if="visible" v-bind="canvasAttrs" ref="theCanvas" />
</template>

<script lang="ts">
import { PDFPageProxy } from 'pdfjs-dist/types/display/api';
import { PageViewport } from 'pdfjs-dist/types/display/display_utils';
import { defineComponent, PropType, computed, onMounted, ref } from 'vue';

const PIXEL_RATIO = window.devicePixelRatio || 1;

export default defineComponent({
  name: 'PdfPage',

  props: {
    pageProxy: {
      type: Object as PropType<PDFPageProxy>,
      required: true,
    },
    scale: { type: Number, required: true },
    visible: { type: Boolean, default: true },
  },

  setup(props, context) {
    let viewport = ref({} as PageViewport);
    const theCanvas = ref<InstanceType<typeof HTMLCanvasElement>>();

    viewport.value = props.pageProxy.getViewport({ scale: props.scale });
    console.log(`Viewport ${viewport.value.height} x ${viewport.value.width}`);

    const actualSizeViewport = computed(() =>
      viewport.value.clone({ scale: props.scale })
    );

    const canvasAttrs = computed(() => {
      const canvasHeight = Math.ceil(viewport.value.height);
      const canvasWidth = Math.ceil(viewport.value.width);

      const { width: actualWidth, height: actualHeight } =
        actualSizeViewport.value;
      console.log('ACTUAL', actualHeight, actualWidth);
      const canvasStyle: string = [
        `height: ${Math.ceil(actualHeight / PIXEL_RATIO)}px;`,
        `width: ${Math.ceil(actualWidth / PIXEL_RATIO)}px;`,
      ].join(' ');

      const attrs = {
        height: canvasHeight,
        width: canvasWidth,
        style: canvasStyle,
      };
      console.log('ATTRS', attrs);
      return attrs;
    });

    const drawPage = () => {
      const canvasContext = theCanvas.value?.getContext('2d');
      console.log('CANVAS CONTEXT', canvasContext);
      if (!canvasContext) {
        throw new Error('No canvas context');
      }
      canvasContext.scale(PIXEL_RATIO, PIXEL_RATIO);

      props.pageProxy
        .render({
          canvasContext,
          viewport: viewport.value,
        })
        .promise.then(() => {
          console.log('Rendered');
          context.emit('rendered', props.pageProxy);
        })
        .catch((error) => {
          throw error;
        });
    };

    onMounted(() => {
      drawPage();
    });

    return {
      canvasAttrs,
      theCanvas,
    };
  },
});
</script>
