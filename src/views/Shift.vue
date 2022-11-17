<template>
  <v-container>
    <v-card class="mt-5" elevation="4" shaped>
      <v-card-text> <shift></shift> </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import shift from "../components/tables/shiftsTable.vue";
export default {
  name: "Home",
  components: {
    shift,
  },
  computed: {},
};
</script>
