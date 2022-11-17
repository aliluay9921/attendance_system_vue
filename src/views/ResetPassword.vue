<template>
  <v-container>
    <!-- <v-card class="mt-5" elevation="4" shaped>
      <v-card-text> <ResetPasswordForm></ResetPasswordForm> </v-card-text>
    </v-card> -->
    <v-card class="mt-5" elevation="4" shaped>
      <v-card-text> <ResetPasswordForm></ResetPasswordForm> </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
import ResetPasswordForm from "../components/forms/ResetPasswordForm.vue";
export default {
  name: "Home",
  components: {
    ResetPasswordForm,
  },
  computed: {},
};
</script>
