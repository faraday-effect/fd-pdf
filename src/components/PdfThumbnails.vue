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

  data() {
    return {
      pageContainers: [] as PdfPageContainer[],
    };
  },

  mounted() {
    const pdfContainer = new PdfContainer(this.url);
    pdfContainer
      .loadPdf()
      .then(() =>
        pdfContainer.getAllPages(1.0).then((pageContainers) => {
          this.pageContainers = pageContainers;
          const theDiv = this.$el as HTMLDivElement;
          console.log('THE DIV', theDiv);
          _.map(this.pageContainers, (pageContainer) =>
            theDiv.appendChild(pageContainer.canvas)
          );
        })
      )
      .catch((error) => {
        throw error;
      });
  },
});
</script>
