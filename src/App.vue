<template>
  <v-app>
    <v-app-bar app color="nutty" v-if="!$route.path.includes('login')" dark>
      <v-spacer></v-spacer>

      <v-btn
        style="color: black"
        dark
        color="creamy"
        rounded
        elevation="6"
        to="/"
      >
        الموضفين
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        dark
        style="color: black"
        color="creamy"
        rounded
        elevation="6"
        to="/attendance"
      >
        الحضور
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        dark
        style="color: black"
        color="creamy"
        rounded
        elevation="6"
        to="/hoilday"
      >
        العطل
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        dark
        style="color: black"
        color="creamy"
        rounded
        elevation="6"
        to="/absents"
      >
        الغياب
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        style="color: black"
        dark
        color="creamy"
        rounded
        elevation="6"
        to="/settings"
      >
        الأعدادات
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        style="color: black"
        dark
        color="creamy"
        rounded
        elevation="6"
        @click="signOut"
      >
        تسجيل خروج
      </v-btn>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
  computed: {
    snackbar: {
      set: function () {
        this.$store.dispatch("snackbarToggle", { toggle: false });
      },
      get: function () {
        return this.$store.state.snackbar;
      },
    },
    textSnackbar: function () {
      return this.$store.state.textSnackbar;
    },
  },
  methods: {
    signOut: function () {
      this.$store.dispatch("resetFields");
      this.user_type = -1;
      console.log("in log out ");
      localStorage.removeItem("token");
      localStorage.removeItem("user_type");

      localStorage.removeItem("user_name");
      this.$store.dispatch("logout").then(() => {
        this.$router.replace("/login");
      });
    },
  },
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Cairo&display=swap");
* {
  font-family: Cairo;
}
#app {
  background-color: #f4f9f9;
  /* background-color: #fff; */
}
</style>
