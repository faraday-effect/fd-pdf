<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import 'pdfjs-dist/webpack';

export default defineComponent({
  name: 'App',
});
</script>
