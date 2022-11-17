<template>
  <v-container>
    <v-card class="mt-5" elevation="4" shaped>
      <v-card-text> <BounsTable></BounsTable> </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import BounsTable from "../components/tables/bonusesTable.vue";
export default {
  name: "Home",
  components: {
    BounsTable,
  },
  computed: {},
};
</script>
