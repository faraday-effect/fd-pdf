<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue';

require('pdfjs-dist/webpack');

export default defineComponent({
  name: 'App',
});
</script>
