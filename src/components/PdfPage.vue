<template>
  <canvas v-if="visible" v-bind="canvasAttrs" />
</template>

<script lang="ts">
import { PDFPageProxy } from 'pdfjs-dist/types/display/api';
import { PageViewport } from 'pdfjs-dist/types/display/display_utils';
import { defineComponent, PropType } from 'vue';

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

  data() {
    return {
      viewport: {} as PageViewport,
    };
  },

  created() {
    this.viewport = this.pageProxy.getViewport({ scale: 1 });
    console.log(`Viewport ${this.viewport.height} x ${this.viewport.width}`);
  },

  mounted() {
    this.drawPage();
  },

  computed: {
    canvasAttrs() {
      const canvasHeight = Math.floor(this.viewport.height * PIXEL_RATIO);
      const canvasWidth = Math.floor(this.viewport.width * PIXEL_RATIO);

      const canvasStyle: string = [
        `height: ${Math.floor(this.viewport.height * this.scale)}px;`,
        `width: ${Math.floor(this.viewport.width * this.scale)}px;`,
      ].join(' ');

      const attrs = {
        height: canvasHeight,
        width: canvasWidth,
        style: canvasStyle,
      };
      console.log('ATTRS', attrs);
      return attrs;
    },
  },

  methods: {
    drawPage() {
      const canvasContext = (this.$el as HTMLCanvasElement).getContext('2d');
      if (!canvasContext) {
        return;
      }
      canvasContext.scale(PIXEL_RATIO, PIXEL_RATIO);

      this.pageProxy
        .render({
          canvasContext,
          viewport: this.viewport,
        })
        .promise.then(() => {
          console.log('Rendered');
          this.$emit('rendered', this.pageProxy);
        })
        .catch((error) => {
          throw error;
        });
    },
  },
});
</script>
