<template>
  <v-container>
    <!-- <v-card class="mt-5" elevation="4" shaped>
      <v-card-text> <employeesTable></employeesTable> </v-card-text>
    </v-card> -->
    <v-card class="mt-5" elevation="4" shaped>
      <v-card-text> <employeesTable></employeesTable> </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import employeesTable from "../components/tables/employeesTable.vue";
export default {
  name: "Home",
  components: {
    employeesTable,
  },
  computed: {},
};
</script>
