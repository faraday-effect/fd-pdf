<template>
  <canvas ref="theCanvas" />
</template>

<script lang="ts">
import { PDFPageProxy } from 'pdfjs-dist/types/display/api';
import { PageViewport } from 'pdfjs-dist/types/display/display_utils';
import { defineComponent, h, PropType } from 'vue';

export default defineComponent({
  name: 'PdfPage',

  props: {
    pageProxy: {
      type: Object as PropType<PDFPageProxy>,
      required: true,
    },
    scale: { type: Number, required: true },
  },

  mounted() {
    const viewport: PageViewport = this.pageProxy.getViewport({ scale: 1 });
    console.log(`Viewport ${viewport.height} x ${viewport.width}`);

    const canvas = this.$refs.theCanvas as HTMLCanvasElement;
    canvas.style.height = `${viewport.height * this.scale}px`;
    canvas.style.width = `${viewport.width * this.scale}px`;

    const pixelRatio = window.devicePixelRatio;
    canvas.height = Math.floor(viewport.height * pixelRatio);
    canvas.width = Math.floor(viewport.width * pixelRatio);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.scale(pixelRatio, pixelRatio);

    this.pageProxy
      .render({
        canvasContext: ctx,
        viewport,
      })
      .promise.then(() => console.log('Rendered'))
      .catch((error) => {
        throw error;
      });
  },
});
</script>

<style>
.pdf-page {
  display: block;
  margin: 0 auto;
}
</style>
