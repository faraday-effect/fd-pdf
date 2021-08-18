<script lang="ts">
import { PDFPageProxy } from 'pdfjs-dist/types/display/api';
import { PageViewport } from 'pdfjs-dist/types/display/display_utils';
import { defineComponent, h, PropType } from 'vue';

// Work around goofy declaration in api.d.ts.
declare class RenderTask {
  get promise(): Promise<void>;
}

interface CanvasAttrs {
  width: number;
  height: number;
  style: string;
  class: string;
}

export default defineComponent({
  name: 'PdfPage',

  props: {
    pageProxy: {
      type: Object as PropType<PDFPageProxy>,
      required: true,
    },
    scale: { type: Number, required: true },
  },

  data() {
    return {
      viewport: {} as PageViewport,
      renderTask: null as RenderTask | null,
    };
  },

  created() {
    this.viewport = this.pageProxy.getViewport({ scale: this.scale });
    console.log('VIEWPORT', this.viewport);
  },

  mounted() {
    console.log('PAGE PROXY', this.pageProxy);
    // this.pageProxy
    //   .getTextContent()
    //   .then((content) => console.log('TEXT CONTENT', content))
    //   .catch((error) => {
    //     throw error;
    //   });
    this.drawPage();
  },

  computed: {
    canvasAttrs(): CanvasAttrs {
      let { width, height } = this.viewport;
      [width, height] = [width, height].map((dim) => Math.ceil(dim));

      const style = this.canvasStyle;

      return {
        width,
        height,
        style,
        class: 'pdf-page',
      };
    },

    canvasStyle(): string {
      const { width: actualSizeWidth, height: actualSizeHeight } =
        this.actualSizeViewport;
      const pixelRatio = window.devicePixelRatio || 1;
      const [pixelWidth, pixelHeight] = [actualSizeWidth, actualSizeHeight].map(
        (dim) => Math.ceil(dim / pixelRatio)
      );
      return `width: ${pixelWidth}px; height: ${pixelHeight}px;`;
    },

    actualSizeViewport(): PageViewport {
      return this.viewport.clone({ scale: this.scale });
    },
  },

  methods: {
    drawPage() {
      console.log('DRAW PAGE');
      if (this.renderTask) {
        console.log('RENDER TASK TRUTHY');
        return;
      }

      const canvasContext = (this.$el as HTMLCanvasElement).getContext('2d');
      if (!canvasContext) {
        throw new Error('Invalid canvas context');
      }

      const renderContext = {
        canvasContext,
        viewport: this.viewport,
      };
      console.log('RENDER CONTEXT', renderContext);
      this.renderTask = this.pageProxy.render(renderContext);
      this.renderTask.promise
        .then(() => {
          this.$emit('rendered', this.pageProxy);
        })
        .catch((error) => {
          throw error;
        });
    },
  },

  render() {
    const { canvasAttrs: attrs } = this;
    console.log('ATTRS', attrs);
    return h('canvas', { attrs });
  },
});
</script>
