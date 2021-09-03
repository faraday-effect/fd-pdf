<template>
  <q-page padding>
    <div class="column" style="height: 100%">
      <div class="col row justify-around text-h6">
        <span>{{ courseNumber }}</span>
        <span>{{ courseName }}</span>
        <span>{{ semester }}</span>
      </div>
      <div class="col text-h3 text-center">
        Non-Deterministic Finite State Automata
      </div>
      <div class="col text-h4 text-center">{{ currentDate }}</div>
      <quick-response-code :qr-code="qrCode" scale="8" />
    </div>
  </q-page>
</template>

<script lang="ts">
import QuickResponseCode from 'components/QuickResponseCode.vue';
export default {
  name: 'SplashPage',
  components: { QuickResponseCode },
  data() {
    return {
      semester: 'Fall 2021',
      courseNumber: 'COS 380',
      courseName: 'Natural Language Processing',
      currentDate: 'F/03-Sep-2021',
      qrCode: 'http://faraday.cse.taylor.edu',
    };
  },
};
</script>
<style></style>
