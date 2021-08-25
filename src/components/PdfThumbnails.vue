<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent, h } from 'vue';
import { PdfContainer, PdfPageContainer } from 'src/helpers/PdfContainer';
import * as _ from 'lodash';

export default defineComponent({
  name: 'PdfThumbnails',

  props: {
    url: { type: String, required: true },
  },

  mounted() {
    const pdfContainer = new PdfContainer(this.url);
    const theDiv = this.$el as HTMLDivElement;
    console.log('THE DIV', theDiv);

    pdfContainer
      .loadPdf()
      .then(() => pdfContainer.getAllPages(1.0))
      .then((pageContainers) => {
        _.map(pageContainers, (pageContainer) =>
          theDiv.appendChild(pageContainer.canvas)
        );
      })
      .then(() => pdfContainer.getOnePage(18, 2))
      .then((pageContainer) => theDiv.appendChild(pageContainer.canvas))
      .catch((error) => {
        throw error;
      });
  },
});
</script>
