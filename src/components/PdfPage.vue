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
    let viewport = {} as PageViewport;
    const theCanvas = ref<InstanceType<typeof HTMLCanvasElement>>();

    viewport = props.pageProxy.getViewport({ scale: 1 });
    console.log(`Viewport ${viewport.height} x ${viewport.width}`);

    const canvasAttrs = computed(() => {
      const canvasHeight = Math.floor(viewport.height * PIXEL_RATIO);
      const canvasWidth = Math.floor(viewport.width * PIXEL_RATIO);

      const canvasStyle: string = [
        `height: ${Math.floor(viewport.height * props.scale)}px;`,
        `width: ${Math.floor(viewport.width * props.scale)}px;`,
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
          viewport: viewport,
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
