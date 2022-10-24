<template>
  <v-container>
    <!-- <v-card class="mt-5" elevation="4" shaped>
      <v-card-text> <employeesTable></employeesTable> </v-card-text>
    </v-card> -->
    <v-card class="mt-5" elevation="4" shaped>
      <v-card-text> <attendanesTable></attendanesTable> </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import attendanesTable from "../components/tables/attendanesTable.vue";
export default {
  name: "Home",
  components: {
    attendanesTable,
  },
  computed: {},
};
</script>
