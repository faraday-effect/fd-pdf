<template>
  <div class="column q-pa-md q-gutter-md">
    <q-btn
      color="secondary"
      label="First"
      :disable="isFirstPage"
      @click="toFirstPage"
    />
    <q-btn
      color="primary"
      label="Prev"
      :disable="!havePreviousPage"
      @click="toPreviousPage"
    />
    <q-slider
      v-model="currentPageIndex"
      :min="0"
      :max="numPages - 1"
      vertical
      label-always
      :label-value="currentPageNumber"
      @change="setCurrentPageIndex"
    />
    <q-btn
      color="primary"
      label="Next"
      :disable="!haveNextPage"
      @click="toNextPage"
    />
    <q-btn
      color="secondary"
      label="Last"
      :disable="isLastPage"
      @click="toLastPage"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  name: 'PdfPagePicker',

  emits: ['pageIndex', 'pageNumber'],

  props: {
    numPages: { type: Number, required: true },
  },

  setup(props, { emit }) {
    const currentPageIndex = ref(0);
    const setCurrentPageIndex = (newIndex: number) => {
      currentPageIndex.value = newIndex;
      emit('pageIndex', currentPageIndex.value);
      emit('pageNumber', currentPageNumber.value);
    };

    const currentPageNumber = computed(() => currentPageIndex.value + 1);

    const havePreviousPage = computed(() => currentPageIndex.value > 0);
    const haveNextPage = computed(
      () => currentPageIndex.value < props.numPages - 1
    );

    const isFirstPage = computed(() => currentPageIndex.value === 0);
    const isLastPage = computed(
      () => currentPageIndex.value === props.numPages - 1
    );

    const toPreviousPage = () =>
      setCurrentPageIndex(currentPageIndex.value - 1);
    const toNextPage = () => setCurrentPageIndex(currentPageIndex.value + 1);

    const toFirstPage = () => setCurrentPageIndex(0);
    const toLastPage = () => setCurrentPageIndex(props.numPages - 1);

    return {
      currentPageIndex,
      currentPageNumber,
      setCurrentPageIndex,

      isFirstPage,
      isLastPage,
      havePreviousPage,
      haveNextPage,

      toPreviousPage,
      toNextPage,
      toFirstPage,
      toLastPage,
    };
  },
});
</script>
