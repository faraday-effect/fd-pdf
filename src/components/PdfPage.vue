<template>
   <canvas v-if="visible" v-bind="canvasAttrs" ref="theCanvas"></canvas>
</template>

<script lang="ts">
import { PDFPageProxy } from 'pdfjs-dist/types/display/api';
import {
  defineComponent,
  PropType,
  computed,
  onMounted,
  ref,
  watch,
} from 'vue';

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
    const theCanvas = ref<InstanceType<typeof HTMLCanvasElement>>();

    const viewport = computed(() => {
      const vp = props.pageProxy.getViewport({ scale: props.scale });
      console.log(`Viewport ${vp.height} x ${vp.width}`);
      return vp;
    });

    const canvasAttrs = computed(() => {
      const canvasHeight = Math.ceil(viewport.value.height);
      const canvasWidth = Math.ceil(viewport.value.width);

      const canvasStyle: string = [
        `width: ${Math.ceil(canvasWidth / PIXEL_RATIO)}px;`,
        `height: ${Math.ceil(canvasHeight / PIXEL_RATIO)}px;`,
      ].join(' ');

      return {
        height: canvasHeight,
        width: canvasWidth,
        style: canvasStyle,
      };
    });

    const drawPage = () => {
      const canvasContext = theCanvas.value?.getContext('2d');
      if (!canvasContext) {
        throw new Error('No canvas context');
      }

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

    onMounted(drawPage);
    watch(viewport, drawPage);

    return {
      canvasAttrs,
      theCanvas,
    };
  },
});
</script>
