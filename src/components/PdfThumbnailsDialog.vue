<template>
  <q-dialog>
    <q-card style="width: 1000px; max-width: 80vw">
      <q-card-section>
        <div class="text-h6">Thumbnails</div>
      </q-card-section>
      <q-card-section>
        <div class="pdf-container row q-gutter-sm justify-center">
          <pdf-page
            v-for="page in pdfDocAsDrawn.pages"
            :key="page.pageNumber"
            :canvas="page.canvas"
            @click="thumbnailClicked"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { PdfDocAsDrawn } from 'src/composables/usePdf';
import PdfPage from 'components/PdfPage.vue';

export default defineComponent({
  name: 'PdfThumbnailsDialog',

  components: { PdfPage },

  props: {
    pdfDocAsDrawn: {
      type: Object as PropType<PdfDocAsDrawn>,
      required: true,
    },
  },

  methods: {
    thumbnailClicked() {
      console.log('THUMBNAIL CLICKED');
    },
  },
});
</script>

<style>
.pdf-container {
  background: teal;
}
</style>
