<template>
  <v-container>
    <!-- <v-card class="mt-5" elevation="4" shaped>
      <v-card-text> <employeesTable></employeesTable> </v-card-text>
    </v-card> -->
    <v-card class="mt-5" elevation="4" shaped>
      <v-card-text> <holidaysTable></holidaysTable> </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import holidaysTable from "../components/tables/holidaysTable.vue";
export default {
  name: "Home",
  components: {
    holidaysTable,
  },
  computed: {},
};
</script>
