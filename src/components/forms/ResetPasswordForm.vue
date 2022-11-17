<template>
  <v-container>
    <v-form ref="form" class="mr-10">
      <v-col cols="12" md="12" lg="12">
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="old_password"
              placeholder="كلمة المرور السابقة"
              label="كلمة المرور السابقة"
              hide-details="auto"
              :rules="[rules.required]"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="new_password"
              placeholder="كلمة المرور الحالية"
              label="كلمة المرور الحالية"
              hide-details="auto"
              :rules="[rules.required]"
              clearable
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="4">
            <v-btn secondary color="secondary" @click="resetPassword">
              تغير كلمة المرور
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-form>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      old_password: "",
      new_password: "",

      rules: {
        required: (value) => !!value || "هذا الحقل مطلوب.",
        // min: (v) => v.length >= 6 || "يجب ان تكون كلمة المرور اكثر من 6 عناصر",
      },
    };
  },

  methods: {
    resetPassword() {
      let data = {};
      data["new_password"] = this.new_password;
      data["old_password"] = this.old_password;
      this.$store.dispatch("setting/resetPassword", data);
      console.log(data);
    },
    addData(data) {
      this.$store.dispatch("employees/addEmployee", data);
      this.$store.dispatch("employees/getEmployees", data);
    },

    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>
