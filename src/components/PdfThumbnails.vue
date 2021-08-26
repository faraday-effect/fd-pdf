<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import * as _ from 'lodash';
import usePdf from 'src/composables/usePdf';

export default defineComponent({
  name: 'PdfThumbnails',

  props: {
    url: { type: String, required: true },
  },

  setup() {
    return usePdf();
  },

  mounted() {
    const theDiv = this.$el as HTMLDivElement;
    console.log('THE DIV', theDiv);

    this.loadPdf(this.url)
      .then(() => this.getAllPages(1.0))
      .then((pageContainers) => {
        _.map(pageContainers, (pageContainer) =>
          theDiv.appendChild(pageContainer.canvas)
        );
      })
      .then(() => this.getOnePage(9, 2))
      .then((pageContainer) => theDiv.appendChild(pageContainer.canvas))
      .catch((error) => {
        throw error;
      });
  },
});
</script>
