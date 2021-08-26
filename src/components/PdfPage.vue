<template>
  <canvas v-if="visible" ref="theCanvas"></canvas>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'PdfPage',

  props: {
    canvas: {
      type: Object as PropType<HTMLCanvasElement>,
      required: true,
    },
    visible: {
      type: Boolean,
      default: true,
    },
  },

  mounted() {
    const theCanvas = this.$refs.theCanvas as HTMLCanvasElement;
    const canvasContext = theCanvas.getContext('2d');
    if (canvasContext) {
      theCanvas.height = this.canvas.height;
      theCanvas.width = this.canvas.width;
      theCanvas.style.height = this.canvas.style.height;
      theCanvas.style.width = this.canvas.style.width;
      canvasContext.drawImage(this.canvas, 0, 0);
      return;
    }
    throw new Error('Something went haywire with the canvas or context');
  },
});
</script>
