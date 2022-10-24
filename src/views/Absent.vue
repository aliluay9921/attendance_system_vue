<template>
  <v-container>
    <!-- <v-card class="mt-5" elevation="4" shaped>
      <v-card-text> <employeesTable></employeesTable> </v-card-text>
    </v-card> -->
    <v-card class="mt-5" elevation="4" shaped>
      <v-card-text> <absentsTable></absentsTable> </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import absentsTable from "../components/tables/absentsTable.vue";
export default {
  name: "Home",
  components: {
    absentsTable,
  },
  computed: {},
};
</script>
