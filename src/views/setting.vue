<template>
  <v-container>
    <!-- <v-card class="mt-5" elevation="4" shaped>
      <v-card-text> <settingsTable></settingsTable> </v-card-text>
    </v-card> -->
    <v-card class="mt-5" elevation="4" shaped>
      <v-card-text> <settingsTable></settingsTable> </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import settingsTable from "../components/tables/settingsTable.vue";
export default {
  name: "Home",
  components: {
    settingsTable,
  },
  computed: {},
};
</script>
