<template>
  <q-page>
    <div class="splash-page">
      <div class="title-text-block">
        <div class="several-columns text-h6">
          <span>{{ courseNumber }}</span>
          <span>{{ courseName }}</span>
          <span>{{ semester }}</span>
        </div>
        <div class="course-title text-center text-h4">
          Non-Deterministic Finite State Automata
        </div>
        <div class="several-columns text-h6">
          <span>{{ presenter }}</span>
          <span>{{ currentDate }}</span>
        </div>
      </div>
      <quick-response-code class="qr-code" :qr-code="qrCode" />
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
      qrCode: 'https://faraday.cse.taylor.edu',
      presenter: 'Dr. Tom Nurkkala',
    };
  },
};
</script>

<style scoped>
.splash-page {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 100vh;
}

.title-text-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem;
  border-bottom: 1px teal solid;
  border-top: 8px teal solid;
}

.several-columns {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  text-align: center;
}

.course-title {
  margin: 2rem 0;
}
</style>
