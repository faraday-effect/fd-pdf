<template>
  <q-page class="row items-center justify-evenly">
    <pdf-document v-bind="{ url, scale }" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PdfDocument from 'components/PdfDocument.vue';

export default defineComponent({
  name: 'IndexPage',

  components: { PdfDocument },

  created() {
    console.log('CREATED Index');
  },
  mounted() {
    console.log('MOUNTED Index');
  },

  data() {
    return {
      url: 'https://cdn.filestackcontent.com/5qOCEpKzQldoRsVatUPS',
      scale: 1,
    };
  },
});
</script>
